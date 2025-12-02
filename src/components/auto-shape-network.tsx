"use client";

import { useAutoShapeNetwork } from "@/hooks/useAutoShapeNetwork";

/**
 * Component that automatically handles Shape Network connection and signing
 * This runs in the background when wallet is connected
 */
export function AutoShapeNetwork() {
  useAutoShapeNetwork();
  return null; // This component doesn't render anything
}

