import { CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI } from "@/config/abis";
import { isValidContractAddress } from "@/helpers/contractValidation";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReadContract } from "wagmi";

/**
 * Hook to get reserve supply and borrow caps
 */
export function useReserveCaps(assetAddress: string, decimals: number = 18) {
  const { contracts, network } = useChainConfig();

  // Check if the protocol data provider contract is valid
  const hasValidContract = isValidContractAddress(
    contracts.protocolDataProvider
  );
  // Also validate the asset address
  const hasValidAsset = isValidContractAddress(assetAddress);

  const { data, isLoading } = useReadContract({
    address: contracts.protocolDataProvider,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getReserveCaps",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: hasValidContract && hasValidAsset,
    },
  });

  if (!data || !hasValidContract || !hasValidAsset) {
    return {
      borrowCap: "0",
      supplyCap: "0",
      isLoading,
    };
  }

  const [borrowCap, supplyCap] = data as [bigint, bigint];

  // Caps are returned as whole token units, not in wei
  // So we just convert to string without formatting
  return {
    borrowCap: borrowCap.toString(),
    supplyCap: supplyCap.toString(),
    borrowCapRaw: borrowCap,
    supplyCapRaw: supplyCap,
    isLoading,
  };
}
