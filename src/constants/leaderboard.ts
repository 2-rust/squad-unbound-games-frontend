/**
 * Leaderboard Constants
 * Constants specific to the leaderboard page
 */

import type React from "react";
import type { LeaderboardViewTab, TimeFilter } from "@/types/leaderboard";

// ============================================
// View Configuration
// ============================================

/** Available leaderboard view tabs */
export const LEADERBOARD_VIEW_TABS: readonly LeaderboardViewTab[] = [
  "Fighter Rank",
  "Trainer Rank",
  "Activity",
] as const;

/** Available time filter options */
export const TIME_FILTERS: readonly TimeFilter[] = [
  "Total",
  "Cycle",
  "Week",
  "Day",
] as const;

// ============================================
// Table Headers Configuration
// ============================================

export const FIGHTER_TABLE_HEADERS = [
  "Rank",
  "", // Empty header for avatar column
  "Fighter TokenId",
  "Fighter Name",
  "Endurance",
  "Agility",
  "Mental Strength",
  "Leadership",
  "Distance Applied",
  "Buy",
] as const;

export const TRAINER_TABLE_HEADERS = [
  "Rank",
  "Trainer",
  "Total Progress",
  "Endurance",
  "Agility",
  "Mental Strength",
  "Leadership",
  "Distance Applied",
  "Fighters Trained",
] as const;

export const ACTIVITY_TABLE_HEADERS = [
  "Rank",
  "Wallet Address",
  "Total Distance",
  "Yoga Sessions",
  "Meditation Sessions",
] as const;

// ============================================
// UI Configuration
// ============================================

/** Loading delay in milliseconds */
export const LOADING_DELAY_MS = 300;

/** Transition delay in milliseconds */
export const TRANSITION_DELAY_MS = 150;

// ============================================
// Asset Paths
// ============================================

/** Default NFT image path */
export const DEFAULT_NFT_IMAGE = "/assets/defaultnft.png";

/** Mintify icon path */
export const MINTIFY_ICON = "/assets/mintify.jpeg";

/** OpenSea icon path */
export const OPENSEA_ICON = "/assets/opensea.png";

// ============================================
// UI Text & Messages
// ============================================

/** Loading message text */
export const LOADING_MESSAGE = "Loading leaderboard...";

/** Tooltip text for Total Distance column */
export const TOTAL_DISTANCE_TOOLTIP = "Includes all distance during the cycles regardless if it's been applied to fighters";

// ============================================
// UI Styles
// ============================================

/** Main wrapper background color */
export const MAIN_BACKGROUND_COLOR = "#000";

/** Main text color */
export const MAIN_TEXT_COLOR = "white";

/** Tabs container inline styles */
export const TABS_CONTAINER_STYLE: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};

/** Link container inline styles */
export const LINK_CONTAINER_STYLE: React.CSSProperties = {
  display: "inline-block",
};

/** Link container with margin inline styles */
export const LINK_CONTAINER_WITH_MARGIN_STYLE: React.CSSProperties = {
  display: "inline-block",
  marginRight: "8px",
};

/** Profile display container styles */
export const PROFILE_DISPLAY_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

/** Avatar image styles */
export const AVATAR_IMAGE_STYLE: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "2px solid #d34836",
  objectFit: "cover",
};

// ============================================
// Podium Configuration
// ============================================

/** Rank emojis for podium display */
export const PODIUM_RANK_EMOJIS = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
} as const;

/** Place names for podium display */
export const PODIUM_PLACE_NAMES = {
  1: "First",
  2: "Second",
  3: "Third",
} as const;

