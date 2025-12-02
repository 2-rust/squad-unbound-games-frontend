// Shape Network Configuration
// Chain ID and RPC details for Shape Network
import { defineChain } from "viem";

// Get the RPC URL
// Wagmi will use the wallet provider's RPC when available (which handles CORS)
// The proxy is only used as a fallback for HTTP transport
const getRpcUrl = () => {
  const directRpcUrl = process.env.NEXT_PUBLIC_SHAPE_RPC_URL || "https://mainnet.shape.network";
  
  // Check if we should use proxy (for development/testing when direct RPC has issues)
  const useProxy = process.env.NEXT_PUBLIC_USE_RPC_PROXY === "true";
  
  if (typeof window !== "undefined" && useProxy) {
    // Use proxy API route to avoid CORS issues
    return `${window.location.origin}/api/rpc`;
  }
  
  // Use direct RPC URL - wallet providers will handle RPC calls
  // HTTP transport will use this URL directly
  return directRpcUrl;
};

// Define Shape Network as a proper Chain using viem's defineChain
export const shapeNetwork = defineChain({
  id: Number(process.env.NEXT_PUBLIC_SHAPE_CHAIN_ID) || 360,
  name: "Shape Network",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [getRpcUrl()],
    },
  },
  blockExplorers: {
    default: {
      name: "Shape Explorer",
      url: process.env.NEXT_PUBLIC_SHAPE_EXPLORER_URL || "https://shapescan.xyz",
    },
  },
  testnet: false,
});

// Message to sign for authentication
export const SHAPE_SIGN_MESSAGE = process.env.NEXT_PUBLIC_SHAPE_SIGN_MESSAGE || 
  "Welcome to Squad Unbound! Please sign this message to authenticate with Shape Network.";

