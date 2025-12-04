/**
 * Leaderboard Types
 * Type definitions for leaderboard data structures
 */

export type LeaderboardViewTab = "Fighter Rank" | "Trainer Rank" | "Activity";
export type TimeFilter = "Total" | "Cycle" | "Week" | "Day";

export type FighterRow = {
  rank: number;
  tokenId: string;
  name: string;
  image?: string;
  endurance: number;
  enduranceDelta?: string;
  agility: number;
  agilityDelta?: string;
  mental: number;
  mentalDelta?: string;
  leadership: number;
  leadershipDelta?: string;
  distance: string;
};

export type TrainerRow = {
  rank: number;
  trainer: string;
  totalProgress: string;
  endurance: string;
  agility: string;
  mental: string;
  leadership: string;
  distance: string;
  fightersTrained: number;
};

export type ActivityRow = {
  rank: number;
  walletAddress: string;
  totalDistance: string;
  yogaSessions: number;
  meditationSessions: number;
};

