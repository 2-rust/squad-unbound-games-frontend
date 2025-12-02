"use client";

import { ReactNode, useState } from "react";
import {
  RainbowKitProvider,
  getDefaultConfig,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  zora,
} from "wagmi/chains";
import { shapeNetwork } from "@/config/shape-network";

// Get WalletConnect project ID from environment variable
// If not set, use a placeholder (WalletConnect will still work but with limited features)
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "00000000000000000000000000000000";

// Warn if using default project ID
if (projectId === "00000000000000000000000000000000" && typeof window !== "undefined") {
  console.warn(
    "⚠️ WalletConnect Project ID not set. Some features may be limited.",
    "Get a free project ID at: https://cloud.walletconnect.com"
  );
}

// Create wagmi config with Shape Network included
// Shape Network is placed first to make it the default/preferred network
// Note: Setting a valid NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID will use WalletConnect Cloud relay
// instead of pulse.walletconnect.org. Without a valid project ID, WalletConnect may use pulse.walletconnect.org
const wagmiConfig = getDefaultConfig({
  appName: "Squad Unbound MVP",
  projectId,
  ssr: true,
  chains: [shapeNetwork, mainnet, polygon, optimism, arbitrum, base, zora],
});

export function Web3Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={midnightTheme({
            borderRadius: "medium",
            accentColor: "#DD4837",
            accentColorForeground: "#ffffff",
          })}
          initialChain={shapeNetwork}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
