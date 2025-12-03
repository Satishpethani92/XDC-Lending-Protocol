import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBlockNumber, usePublicClient } from "wagmi";

export interface Transaction {
  hash: string;
  type: "Supply" | "Withdraw" | "Borrow" | "Repay";
  asset: string;
  amount: string;
  timestamp: number;
  blockNumber: bigint;
}

interface CachedData {
  transactions: Transaction[];
  lastFetchedBlock: bigint;
  timestamp: number;
}

interface UseTransactionHistoryParams {
  userAddress?: string;
  enabled?: boolean;
}

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// IndexedDB helpers for efficient storage
const DB_NAME = "tx_history_db";
const DB_VERSION = 2;
const STORE_NAME = "transactions";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      const store = db.createObjectStore(STORE_NAME, { keyPath: "cacheKey" });
      store.createIndex("timestamp", "timestamp", { unique: false });
    };
  });
};

const getCachedData = async (cacheKey: string): Promise<CachedData | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(cacheKey);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve({
            ...result,
            lastFetchedBlock: BigInt(result.lastFetchedBlock),
            transactions: result.transactions.map((tx: any) => ({
              ...tx,
              blockNumber: BigInt(tx.blockNumber),
            })),
          });
        } else {
          resolve(null);
        }
      };
    });
  } catch {
    return null;
  }
};

const setCachedData = async (
  cacheKey: string,
  data: CachedData
): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const serialized = {
        cacheKey,
        ...data,
        lastFetchedBlock: data.lastFetchedBlock.toString(),
        transactions: data.transactions.map((tx) => ({
          ...tx,
          blockNumber: tx.blockNumber.toString(),
        })),
      };
      const request = store.put(serialized);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (err) {
    console.error("Error caching transactions:", err);
  }
};

const getCacheKey = (address: string, chainId: number) =>
  `tx_history_v3_${address.toLowerCase()}_${chainId}`;

const CHUNK_SIZE = 100000n;
const MAX_CONCURRENT_REQUESTS = 4;

/**
 * Simplified transaction history hook
 * - First visit: fetches all from poolDeploymentBlock to current
 * - Subsequent visits: fetches only new blocks since last fetch
 * - Stores transactions and lastFetchedBlock in IndexedDB
 */
export function useTransactionHistory({
  userAddress,
  enabled = true,
}: UseTransactionHistoryParams = {}): UseTransactionHistoryReturn {
  const { contracts, poolDeploymentBlock } = useChainConfig();
  const { address: connectedAddress, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: currentBlockNumber } = useBlockNumber();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInProgress = useRef(false);
  const hasFetched = useRef(false);

  const targetAddress = userAddress || connectedAddress;
  const cacheKey = useMemo(
    () =>
      targetAddress && chain?.id ? getCacheKey(targetAddress, chain.id) : null,
    [targetAddress, chain?.id]
  );

  const fetchTransactions = useCallback(async () => {
    if (
      !targetAddress ||
      !publicClient ||
      !currentBlockNumber ||
      !enabled ||
      !cacheKey ||
      poolDeploymentBlock === undefined
    ) {
      return;
    }

    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Load cached data
      const cached = await getCachedData(cacheKey);
      let fromBlock: bigint;
      let existingTransactions: Transaction[] = [];

      if (cached && cached.lastFetchedBlock > 0n) {
        // Subsequent visit: fetch from last fetched block + 1
        fromBlock = cached.lastFetchedBlock + 1n;
        existingTransactions = cached.transactions;
      } else {
        // First visit: fetch from deployment block
        fromBlock = poolDeploymentBlock;
      }

      // If we're already up to date, just use cached data
      if (fromBlock >= currentBlockNumber) {
        setTransactions(existingTransactions);
        setIsLoading(false);
        fetchInProgress.current = false;
        return;
      }

      const toBlock = currentBlockNumber;

      // Create chunk ranges
      const chunks: Array<{ from: bigint; to: bigint }> = [];
      let chunkStart = fromBlock;
      while (chunkStart < toBlock) {
        const chunkEnd =
          chunkStart + CHUNK_SIZE > toBlock ? toBlock : chunkStart + CHUNK_SIZE;
        chunks.push({ from: chunkStart, to: chunkEnd });
        chunkStart = chunkEnd + 1n;
      }

      // Fetch logs helper
      const fetchChunkLogs = async (
        eventName: string,
        args: any,
        chunk: { from: bigint; to: bigint }
      ): Promise<any[]> => {
        try {
          return await publicClient.getLogs({
            address: contracts.pool,
            event: POOL_ABI.find((e: any) => e.name === eventName) as any,
            fromBlock: chunk.from,
            toBlock: chunk.to,
            args,
          });
        } catch (err) {
          console.error(`Error fetching ${eventName} logs:`, err);
          return [];
        }
      };

      // Process chunks with limited concurrency
      const allLogs: any[] = [];

      for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_REQUESTS) {
        const chunkBatch = chunks.slice(i, i + MAX_CONCURRENT_REQUESTS);

        const batchResults = await Promise.all(
          chunkBatch.flatMap((chunk) => [
            fetchChunkLogs("Supply", { onBehalfOf: targetAddress }, chunk),
            fetchChunkLogs("Withdraw", { user: targetAddress }, chunk),
            fetchChunkLogs("Borrow", { onBehalfOf: targetAddress }, chunk),
            fetchChunkLogs("Repay", { user: targetAddress }, chunk),
          ])
        );

        allLogs.push(...batchResults.flat());
      }

      // Get unique block numbers and batch fetch blocks
      const uniqueBlockNumbers = [
        ...new Set(allLogs.map((log) => log.blockNumber)),
      ];

      const blockCache = new Map<bigint, { timestamp: bigint }>();
      for (
        let i = 0;
        i < uniqueBlockNumbers.length;
        i += MAX_CONCURRENT_REQUESTS * 2
      ) {
        const blockBatch = uniqueBlockNumbers.slice(
          i,
          i + MAX_CONCURRENT_REQUESTS * 2
        );
        const blocks = await Promise.all(
          blockBatch.map((blockNumber) =>
            publicClient.getBlock({ blockNumber })
          )
        );
        blocks.forEach((block) => blockCache.set(block.number, block));
      }

      // Process logs into transactions
      const newTransactions: Transaction[] = allLogs
        .map((log) => {
          const block = blockCache.get(log.blockNumber);
          const eventName = log.eventName as Transaction["type"];
          return {
            hash: log.transactionHash,
            type: eventName,
            asset: log.args.reserve || "Unknown",
            amount: log.args.amount?.toString() || "0",
            timestamp: block ? Number(block.timestamp) : 0,
            blockNumber: log.blockNumber,
          };
        })
        .filter((tx) => tx.timestamp > 0);

      // Merge and deduplicate
      const txMap = new Map<string, Transaction>();
      [...existingTransactions, ...newTransactions].forEach((tx) => {
        const key = `${tx.hash}_${tx.type}_${tx.blockNumber}`;
        if (!txMap.has(key)) {
          txMap.set(key, tx);
        }
      });

      const mergedTransactions = Array.from(txMap.values()).sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setTransactions(mergedTransactions);

      // Save to cache with current block number
      await setCachedData(cacheKey, {
        transactions: mergedTransactions,
        lastFetchedBlock: currentBlockNumber,
        timestamp: Date.now(),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Failed to fetch transactions");
      setError(errorMessage);
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [
    targetAddress,
    publicClient,
    currentBlockNumber,
    enabled,
    cacheKey,
    contracts.pool,
    poolDeploymentBlock,
  ]);

  // Fetch on mount (only once per session)
  useEffect(() => {
    if (!hasFetched.current && currentBlockNumber) {
      hasFetched.current = true;
      fetchTransactions();
    }
  }, [fetchTransactions, currentBlockNumber]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}
