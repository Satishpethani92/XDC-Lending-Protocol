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
  oldestBlock: bigint;
  newestBlock: bigint;
  timestamp: number;
}

interface UseTransactionHistoryParams {
  userAddress?: string;
  blockRange?: bigint;
  enabled?: boolean;
  cacheEnabled?: boolean;
  cacheDuration?: number;
  onBlockRangeChange?: (newRange: bigint) => void;
  /** Fetch all transactions from contract deployment block */
  fetchAllHistory?: boolean;
}

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchOlderTransactions: (customBlockCount?: bigint) => void;
  fetchAllFromDeployment: () => void;
  currentBlockRange: bigint;
  blocksFetched: bigint;
  blocksRemaining: bigint;
  /** Progress percentage (0-100) */
  progress: number;
}

// IndexedDB helpers for efficient storage
const DB_NAME = "tx_history_db";
const DB_VERSION = 1;
const STORE_NAME = "transactions";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "cacheKey" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
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
          // Deserialize bigints
          resolve({
            ...result,
            oldestBlock: BigInt(result.oldestBlock),
            newestBlock: BigInt(result.newestBlock),
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
    // Fallback to localStorage
    return getLocalStorageCache(cacheKey);
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
      // Serialize bigints for storage
      const serialized = {
        cacheKey,
        ...data,
        oldestBlock: data.oldestBlock.toString(),
        newestBlock: data.newestBlock.toString(),
        transactions: data.transactions.map((tx) => ({
          ...tx,
          blockNumber: tx.blockNumber.toString(),
        })),
      };
      const request = store.put(serialized);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch {
    // Fallback to localStorage
    setLocalStorageCache(cacheKey, data);
  }
};

// LocalStorage fallback
const getLocalStorageCache = (cacheKey: string): CachedData | null => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return {
      ...parsed,
      oldestBlock: BigInt(parsed.oldestBlock),
      newestBlock: BigInt(parsed.newestBlock),
      transactions: parsed.transactions.map((tx: any) => ({
        ...tx,
        blockNumber: BigInt(tx.blockNumber),
      })),
    };
  } catch {
    return null;
  }
};

const setLocalStorageCache = (cacheKey: string, data: CachedData): void => {
  try {
    const serialized = JSON.stringify({
      ...data,
      oldestBlock: data.oldestBlock.toString(),
      newestBlock: data.newestBlock.toString(),
      transactions: data.transactions.map((tx) => ({
        ...tx,
        blockNumber: tx.blockNumber.toString(),
      })),
    });
    localStorage.setItem(cacheKey, serialized);
  } catch (err) {
    console.error("Error caching to localStorage:", err);
  }
};

const getCacheKey = (address: string, chainId: number) =>
  `tx_history_v2_${address.toLowerCase()}_${chainId}`;

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_BLOCK_RANGE = 500000n;
const CHUNK_SIZE = 100000n; // Smaller chunks for better parallelization
const MAX_CONCURRENT_REQUESTS = 4; // Limit concurrent RPC calls

/**
 * Enhanced hook for fetching transaction history with incremental updates
 * Features:
 * - Incremental fetching (only fetches new blocks)
 * - IndexedDB storage for larger datasets
 * - Request deduplication
 * - Optimized parallel chunk processing
 * - Automatic deduplication of transactions
 * - Fetch all history from contract deployment
 */
export function useTransactionHistory({
  userAddress,
  blockRange = DEFAULT_BLOCK_RANGE,
  enabled = true,
  cacheEnabled = true,
  cacheDuration = DEFAULT_CACHE_DURATION,
  onBlockRangeChange,
  fetchAllHistory = false,
}: UseTransactionHistoryParams = {}): UseTransactionHistoryReturn {
  const { contracts, poolDeploymentBlock } = useChainConfig();
  const { address: connectedAddress, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: currentBlockNumber } = useBlockNumber({ watch: true });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentBlockRange, setCurrentBlockRange] =
    useState<bigint>(blockRange);
  const [blocksFetched, setBlocksFetched] = useState<bigint>(0n);
  const [blocksRemaining, setBlocksRemaining] = useState<bigint>(0n);
  const [fetchAll, setFetchAll] = useState(fetchAllHistory);

  // Request deduplication
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef<string>("");
  const cachedDataRef = useRef<CachedData | null>(null);

  const targetAddress = userAddress || connectedAddress;
  const cacheKey = useMemo(
    () =>
      targetAddress && chain?.id ? getCacheKey(targetAddress, chain.id) : null,
    [targetAddress, chain?.id]
  );

  // Load cached data on mount
  useEffect(() => {
    if (!cacheEnabled || !cacheKey) return;

    const loadCache = async () => {
      const cached = await getCachedData(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        cachedDataRef.current = cached;
        setTransactions(cached.transactions);
      }
    };
    loadCache();
  }, [cacheKey, cacheEnabled, cacheDuration]);

  const fetchTransactions = useCallback(async () => {
    if (!targetAddress || !publicClient || !currentBlockNumber || !enabled) {
      return;
    }

    // Request deduplication
    const fetchParams = `${targetAddress}_${currentBlockNumber}_${currentBlockRange}_${fetchAll}`;
    if (fetchInProgress.current && lastFetchParams.current === fetchParams) {
      return;
    }

    fetchInProgress.current = true;
    lastFetchParams.current = fetchParams;
    setIsLoading(true);
    setError(null);

    try {
      // Determine the starting block
      let targetFromBlock: bigint;
      if (fetchAll && poolDeploymentBlock !== undefined) {
        // Fetch from contract deployment
        targetFromBlock = poolDeploymentBlock;
      } else {
        targetFromBlock =
          currentBlockNumber > currentBlockRange
            ? currentBlockNumber - currentBlockRange
            : 0n;
      }

      const cached = cachedDataRef.current;
      let fromBlock = targetFromBlock;
      let toBlock = currentBlockNumber;
      let existingTransactions: Transaction[] = [];

      // Incremental fetch: only fetch blocks we don't have
      if (cached && cacheEnabled) {
        if (
          cached.newestBlock >= currentBlockNumber &&
          cached.oldestBlock <= targetFromBlock
        ) {
          // Cache covers the entire range, no fetch needed
          setIsLoading(false);
          fetchInProgress.current = false;
          return;
        }

        // Determine what ranges we need to fetch
        if (cached.newestBlock < currentBlockNumber) {
          // Need to fetch newer blocks
          fromBlock = cached.newestBlock + 1n;
          existingTransactions = cached.transactions.filter(
            (tx) => tx.blockNumber >= targetFromBlock
          );
        }
        if (cached.oldestBlock > targetFromBlock) {
          // Need to fetch older blocks (user requested more history)
          toBlock = cached.oldestBlock - 1n;
          fromBlock = targetFromBlock;
          existingTransactions = cached.transactions;
        }
      }

      const totalBlocksToFetch = toBlock - fromBlock;
      if (totalBlocksToFetch <= 0n) {
        setIsLoading(false);
        fetchInProgress.current = false;
        return;
      }

      setBlocksRemaining(totalBlocksToFetch);
      setBlocksFetched(0n);

      // Create chunk ranges
      const chunks: Array<{ from: bigint; to: bigint }> = [];
      let chunkStart = fromBlock;
      while (chunkStart < toBlock) {
        const chunkEnd =
          chunkStart + CHUNK_SIZE > toBlock ? toBlock : chunkStart + CHUNK_SIZE;
        chunks.push({ from: chunkStart, to: chunkEnd });
        chunkStart = chunkEnd + 1n;
      }

      // Fetch logs with controlled concurrency
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
      let processedBlocks = 0n;

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

        // Update progress
        const blocksInBatch = chunkBatch.reduce(
          (sum, chunk) => sum + (chunk.to - chunk.from),
          0n
        );
        processedBlocks += blocksInBatch;
        setBlocksFetched(processedBlocks);
        setBlocksRemaining(totalBlocksToFetch - processedBlocks);
      }

      // Get unique block numbers and batch fetch blocks
      const uniqueBlockNumbers = [
        ...new Set(allLogs.map((log) => log.blockNumber)),
      ];

      // Batch block fetches with concurrency limit
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

      // Merge with existing transactions and deduplicate
      const txMap = new Map<string, Transaction>();
      [...existingTransactions, ...newTransactions].forEach((tx) => {
        const key = `${tx.hash}_${tx.type}_${tx.blockNumber}`;
        if (!txMap.has(key)) {
          txMap.set(key, tx);
        }
      });

      const mergedTransactions = Array.from(txMap.values())
        .filter((tx) => tx.blockNumber >= targetFromBlock)
        .sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(mergedTransactions);

      // Update cache
      if (cacheEnabled && cacheKey) {
        const newCacheData: CachedData = {
          transactions: mergedTransactions,
          oldestBlock: targetFromBlock,
          newestBlock: currentBlockNumber,
          timestamp: Date.now(),
        };
        cachedDataRef.current = newCacheData;
        await setCachedData(cacheKey, newCacheData);
      }
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
    currentBlockRange,
    contracts.pool,
    cacheEnabled,
    cacheKey,
    fetchAll,
    poolDeploymentBlock,
  ]);

  const fetchOlderTransactions = useCallback(
    (customBlockCount?: bigint) => {
      setFetchAll(false);
      const newRange = customBlockCount ?? currentBlockRange + 500000n;
      setCurrentBlockRange(newRange);
      onBlockRangeChange?.(newRange);
    },
    [currentBlockRange, onBlockRangeChange]
  );

  const fetchAllFromDeployment = useCallback(() => {
    if (poolDeploymentBlock === undefined) {
      console.warn("Pool deployment block not configured for this chain");
      return;
    }
    // Clear cache to force full refetch
    cachedDataRef.current = null;
    // Reset fetch params to allow re-fetch
    lastFetchParams.current = "";
    setFetchAll(true);
  }, [poolDeploymentBlock]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate progress percentage
  const progress = useMemo(() => {
    const total = blocksFetched + blocksRemaining;
    if (total === 0n) return 0;
    return Number((blocksFetched * 100n) / total);
  }, [blocksFetched, blocksRemaining]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
    fetchOlderTransactions,
    fetchAllFromDeployment,
    currentBlockRange,
    blocksFetched,
    blocksRemaining,
    progress,
  };
}
