import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { http } from "viem";
import { WagmiProvider } from "wagmi";
import { xdc, xdcTestnet } from "wagmi/chains";

// Get RPC URLs from environment variables
const RPC_XDC_MAINNET =
  import.meta.env.VITE_RPC_XDC_MAINNET || "https://rpc.xinfin.network";
const RPC_XDC_APOTHEM =
  import.meta.env.VITE_RPC_XDC_APOTHEM || "https://rpc.apothem.network";
const WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

export const config = getDefaultConfig({
  appName: "Creditify",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [xdc, xdcTestnet],

  transports: {
    [xdc.id]: http(RPC_XDC_MAINNET),
    [xdcTestnet.id]: http(RPC_XDC_APOTHEM),
  },
  batch: {
    multicall: false,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 5000,
      refetchInterval: 10000,
    },
  },
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = lightTheme({
    accentColor: "#ABDFEF",
    accentColorForeground: "#0B1120",
    borderRadius: "medium",
    fontStack: "system",
    overlayBlur: "small",
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={xdcTestnet} theme={theme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
