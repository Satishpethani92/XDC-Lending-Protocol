import { xdc, xdcTestnet } from "wagmi/chains";
import { getChainLogo } from "./tokenLogos";

export interface ChainConfig {
  contracts: {
    pool: `0x${string}`;
    poolAddressesProvider: `0x${string}`;
    uiPoolDataProvider: `0x${string}`;
    protocolDataProvider: `0x${string}`;
    walletBalanceProvider: `0x${string}`;
    oracle: `0x${string}`;
    wrappedTokenGateway: `0x${string}`;
    uiIncentiveDataProvider?: `0x${string}`;
  };
  // Block number when the Pool contract was deployed (for fetching all historical txs)
  poolDeploymentBlock?: bigint;
  tokens: {
    // Wrapped native token (WXDC)
    wrappedNative: {
      address: `0x${string}`;
      symbol: string;
      decimals: number;
      aToken: `0x${string}`;
      variableDebtToken: `0x${string}`;
    };
    usdc: {
      address: `0x${string}`;
      symbol: string;
      decimals: number;
      aToken: `0x${string}`;
      variableDebtToken: `0x${string}`;
    };
    cgo: {
      address: `0x${string}`;
      symbol: string;
      decimals: number;
      aToken: `0x${string}`;
      variableDebtToken: `0x${string}`;
    };
  };
  network: {
    name: string;
    chainId: number;
    icon: string;
    nativeToken: {
      symbol: string;
      name: string;
      decimals: number;
    };
  };
}

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // XDC Mainnet
  [xdc.id]: {
    contracts: {
      pool: "0x0000000000000000000000000000000000000000",
      poolAddressesProvider: "0x0000000000000000000000000000000000000000",
      uiPoolDataProvider: "0x0000000000000000000000000000000000000000",
      protocolDataProvider: "0x0000000000000000000000000000000000000000",
      walletBalanceProvider: "0x0000000000000000000000000000000000000000",
      oracle: "0x0000000000000000000000000000000000000000",
      wrappedTokenGateway: "0x0000000000000000000000000000000000000000",
      uiIncentiveDataProvider: "0x0000000000000000000000000000000000000000",
    },
    poolDeploymentBlock: 0n, // TODO: Set when mainnet is deployed
    tokens: {
      wrappedNative: {
        address: "0x951857744785E80e2De051c32EE7b25f9c458C42", // WXDC on mainnet
        symbol: "WXDC",
        decimals: 18,
        aToken: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
        variableDebtToken: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
      },
      usdc: {
        address: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
        variableDebtToken: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
      },
      cgo: {
        address: "0x0000000000000000000000000000000000000000", // TODO: Add mainnet address
        symbol: "CGO",
        decimals: 18,
        aToken: "0x0000000000000000000000000000000000000000",
        variableDebtToken: "0x0000000000000000000000000000000000000000",
      },
    },
    network: {
      name: "XDC Mainnet",
      chainId: 50,
      icon: getChainLogo(50),
      nativeToken: {
        symbol: "XDC",
        name: "XDC Network",
        decimals: 18,
      },
    },
  },
  // XDC Apothem Testnet (Auto-generated from .env)
  [xdcTestnet.id]: {
    contracts: {
      pool: "0x0d41D65B4b9410917E101fb9eb709E48B8D10523",
      poolAddressesProvider: "0x299F4b500309fFEAe459af5Baf5e35784dDC8664",
      uiPoolDataProvider: "0xbab1762770DcC776d0D13143DBdC90F228A4bd63",
      protocolDataProvider: "0x91620DE48437d7EDDAe04E7ed8DC686586A7FB53",
      walletBalanceProvider: "0x95A99E0fB0E55CD5290961c4d8070EA945157786",
      oracle: "0xFc07A4AeabC6D09D59946d2845b9F3603acB41F0",
      wrappedTokenGateway: "0xA6FDF78aa29A7A34812fa8B26cE692D6b54e2747",
      uiIncentiveDataProvider: "0x41211e3fA59148EbFFc1bc6E08868CC6DD915320",
    },
    // Pool contract deployment block on Apothem testnet (first event at 76425660)
    poolDeploymentBlock: 76420000n,
    tokens: {
      wrappedNative: {
        address: "0xC2EABDC14A96A48ee56Dec9917d9057AB93439Ab", // WXDC on testnet
        symbol: "WXDC",
        decimals: 18,
        aToken: "0x02946967ea4E5336F9B4F22D4385C5019D23AA93",
        variableDebtToken: "0x9cB8a1c49957397dea6C16ba088CE7284523C33C",
      },
      usdc: {
        address: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xa3bc6e51261e4a8c6addea92a4f28e87dd17c1c7",
        variableDebtToken: "0x095d1870d1ebb9997472C8C188AaAA9Cd0824Bd7",
      },
      cgo: {
        address: "0x394Dbd36Bf533cD4769FDc121EAb73A6f8Ad5040",
        symbol: "CGO",
        decimals: 18,
        aToken: "0x877910eabe5c0bffc5a9b2ecd90f21f67a8e4ac5",
        variableDebtToken: "0xa2aa7d8c2c82ca64215f4ef57050b4d956778ad1",
      },
    },
    network: {
      name: "XDC Apothem",
      chainId: 51,
      icon: getChainLogo(51),
      nativeToken: {
        symbol: "XDC",
        name: "XDC Network",
        decimals: 18,
      },
    },
  },
};

export const getChainConfig = (chainId: number | undefined): ChainConfig => {
  if (!chainId || !CHAIN_CONFIGS[chainId]) {
    // Default to XDC Apothem
    return CHAIN_CONFIGS[xdcTestnet.id];
  }
  return CHAIN_CONFIGS[chainId];
};
