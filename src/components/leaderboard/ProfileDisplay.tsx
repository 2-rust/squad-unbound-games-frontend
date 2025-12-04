"use client";

/**
 * ProfileDisplay Component
 * Displays user profile with avatar and name
 */

import { useUserProfile } from "@/hooks/useUserProfile";
import { ImageWithFallback } from "./ImageWithFallback";
import { PROFILE_DISPLAY_STYLE, AVATAR_IMAGE_STYLE } from "@/constants/leaderboard";

type ProfileDisplayProps = {
  walletAddress: string;
  className?: string;
};

/**
 * Displays a user's profile, including their avatar and username (or wallet address if no username).
 * @param {ProfileDisplayProps} props - The properties for the component.
 * @param {string} props.walletAddress - The wallet address of the user.
 * @param {string} [props.className] - Optional CSS class name for the container div.
 * @returns {JSX.Element} The rendered profile display component.
 */
export function ProfileDisplay({ walletAddress, className }: ProfileDisplayProps): JSX.Element {
  const { getProfileForWallet } = useUserProfile();
  const profile = getProfileForWallet(walletAddress);
  const displayName = profile?.username || walletAddress;
  const displayAvatar = profile?.avatar;

  return (
    <div className={className} style={PROFILE_DISPLAY_STYLE}>
      {displayAvatar && (
        <ImageWithFallback
          src={displayAvatar}
          alt={displayName}
          className=""
          style={AVATAR_IMAGE_STYLE}
        />
      )}
      <span>{displayName}</span>
    </div>
  );
}

