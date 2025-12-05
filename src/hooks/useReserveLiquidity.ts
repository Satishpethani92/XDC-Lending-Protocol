import { ERC20_ABI, POOL_ABI } from "@/config/abis";
import { isValidContractAddress } from "@/helpers/contractValidation";
import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Hook to get available liquidity in a reserve
 * Available liquidity = underlying token balance in cToken contract
 */
export function useReserveLiquidity(
  assetAddress: string,
  decimals: number = 18
) {
  const { contracts, network } = useChainConfig();

  // Check if the pool contract is valid
  const hasValidContract = isValidContractAddress(contracts.pool);
  // Also validate the asset address
  const hasValidAsset = isValidContractAddress(assetAddress);

  // First get the cToken address from reserve data
  const { data: reserveData } = useReadContract({
    address: contracts.pool,
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: hasValidContract && hasValidAsset,
    },
  });

  const reserveDataAny = reserveData as any;

  // Get underlying token balance of cToken (actual available liquidity)
  const { data: underlyingBalance, isLoading } = useReadContract({
    address: assetAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [reserveDataAny?.cTokenAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!reserveDataAny?.cTokenAddress,
    },
  });

  if (!underlyingBalance) {
    return {
      availableLiquidity: "0",
      availableLiquidityRaw: BigInt(0),
      isLoading,
    };
  }

  return {
    availableLiquidity: formatUnits(underlyingBalance as bigint, decimals),
    availableLiquidityRaw: underlyingBalance as bigint,
    isLoading,
  };
}
