"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useSwitchChain, useSignMessage } from "wagmi";
import { shapeNetwork, SHAPE_SIGN_MESSAGE } from "@/config/shape-network";

/**
 * Hook to automatically switch to Shape Network and sign message when wallet connects
 */
export function useAutoShapeNetwork() {
  const { isConnected, chainId, address } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { signMessage, isPending: isSigning } = useSignMessage();
  const hasSignedRef = useRef<string | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!isConnected || !address || isProcessingRef.current) return;

    // Reset signed status if address changes
    if (hasSignedRef.current !== address) {
      hasSignedRef.current = null;
    }

    // Check if already on Shape Network
    if (chainId === shapeNetwork.id) {
      // Only sign once per address
      if (hasSignedRef.current === address) return;

      // Automatically sign message for authentication
      const signForShape = async () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        
        try {
          await signMessage({
            message: SHAPE_SIGN_MESSAGE,
          });
          hasSignedRef.current = address;
        } catch (error: any) {
          // User rejected the signature request
          if (error?.code === 4001 || error?.message?.includes("rejected")) {
            console.log("User rejected Shape Network signature");
          } else {
            console.error("Failed to sign message for Shape Network:", error);
          }
        } finally {
          isProcessingRef.current = false;
        }
      };

      // Sign message after a short delay to ensure wallet is ready
      const timer = setTimeout(() => {
        signForShape();
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // Switch to Shape Network automatically
      const switchToShape = async () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
          await switchChain({ chainId: shapeNetwork.id });
        } catch (error: any) {
          // If switch fails (e.g., network not in wallet), try to add it first
          const errorMessage = error?.message || "";
          const errorCode = error?.code;
          
          if (
            errorCode === 4902 ||
            errorMessage.includes("Unrecognized chain") ||
            errorMessage.includes("not added") ||
            errorCode === -32603
          ) {
            if (typeof window !== "undefined" && (window as any).ethereum) {
              try {
                await (window as any).ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: `0x${shapeNetwork.id.toString(16)}`,
                      chainName: shapeNetwork.name,
                      nativeCurrency: shapeNetwork.nativeCurrency,
                      rpcUrls: shapeNetwork.rpcUrls.default.http,
                      blockExplorerUrls: shapeNetwork.blockExplorers
                        ? [shapeNetwork.blockExplorers.default.url]
                        : undefined,
                    },
                  ],
                });
                // After adding, try to switch again
                setTimeout(() => {
                  switchChain({ chainId: shapeNetwork.id }).catch(() => {
                    isProcessingRef.current = false;
                  });
                }, 1000);
              } catch (addError: any) {
                console.error("Failed to add Shape Network:", addError);
                isProcessingRef.current = false;
              }
            } else {
              isProcessingRef.current = false;
            }
          } else if (errorCode === 4001 || errorMessage.includes("rejected")) {
            // User rejected the switch
            console.log("User rejected Shape Network switch");
            isProcessingRef.current = false;
          } else {
            console.error("Failed to switch to Shape Network:", error);
            isProcessingRef.current = false;
          }
        }
      };

      switchToShape();
    }
  }, [isConnected, chainId, address, switchChain, signMessage]);

  return {
    isSwitching,
    isSigning,
    isOnShapeNetwork: chainId === shapeNetwork.id,
  };
}

