import { CTOKEN_ABI } from "@/config/abis";
import { useReadContract } from "wagmi";

/**
 * Hook to check cToken allowance for a spender (e.g., WrappedTokenGateway)
 */
export const useCTokenAllowance = (
  cTokenAddress: string | undefined,
  ownerAddress: string | undefined,
  spenderAddress: string | undefined
) => {
  const { data, isLoading, error, refetch } = useReadContract({
    address: cTokenAddress as `0x${string}`,
    abi: CTOKEN_ABI,
    functionName: "allowance",
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    query: {
      enabled: !!cTokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });

  // Format the allowance (cTokens typically have 18 decimals, but we'll keep it as bigint)
  const allowance = data as bigint | undefined;

  return {
    allowance: allowance || BigInt(0),
    isLoading,
    error,
    refetch,
  };
};
