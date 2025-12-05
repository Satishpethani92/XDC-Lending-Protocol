import { CTOKEN_ABI } from "@/config/abis";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Hook to get total supply of an cToken (total supplied to the reserve)
 */
export function useReserveSupply(cTokenAddress: string, decimals: number = 18) {
  const { data, isLoading } = useReadContract({
    address: cTokenAddress as `0x${string}`,
    abi: CTOKEN_ABI,
    functionName: "totalSupply",
  });

  if (!data) {
    return {
      totalSupply: "0",
      totalSupplyRaw: BigInt(0),
      isLoading,
    };
  }

  return {
    totalSupply: formatUnits(data as bigint, decimals),
    totalSupplyRaw: data as bigint,
    isLoading,
  };
}
