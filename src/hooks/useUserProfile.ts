"use client";

import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  username?: string;
  avatar?: string; // Base64 or URL
  walletAddress: string;
}

const PROFILE_STORAGE_KEY = "user_profile_";

export function useUserProfile() {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get storage key for current wallet
  const getStorageKey = useCallback((wallet: string) => {
    return `${PROFILE_STORAGE_KEY}${wallet.toLowerCase()}`;
  }, []);

  // Load profile from localStorage
  useEffect(() => {
    if (!address) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const storageKey = getStorageKey(address);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setProfile(parsed);
      } else {
        // Initialize with wallet address
        setProfile({ walletAddress: address });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile({ walletAddress: address });
    } finally {
      setIsLoading(false);
    }
  }, [address, getStorageKey]);

  // Update profile
  const updateProfile = useCallback(
    (updates: Partial<Omit<UserProfile, "walletAddress">>) => {
      if (!address) return;

      try {
        const storageKey = getStorageKey(address);
        const current = profile || { walletAddress: address };
        const updated: UserProfile = {
          ...current,
          ...updates,
          walletAddress: address, // Always keep wallet address
        };

        localStorage.setItem(storageKey, JSON.stringify(updated));
        setProfile(updated);
        return true;
      } catch (error) {
        console.error("Error updating profile:", error);
        return false;
      }
    },
    [address, profile, getStorageKey]
  );

  // Get profile for a specific wallet (for leaderboard)
  const getProfileForWallet = useCallback(
    (wallet: string): UserProfile | null => {
      try {
        const storageKey = getStorageKey(wallet);
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored) as UserProfile;
        }
      } catch (error) {
        console.error("Error getting profile:", error);
      }
      return null;
    },
    [getStorageKey]
  );

  return {
    profile,
    isLoading,
    updateProfile,
    getProfileForWallet,
    hasProfile: Boolean(profile && (profile.username || profile.avatar)),
  };
}

