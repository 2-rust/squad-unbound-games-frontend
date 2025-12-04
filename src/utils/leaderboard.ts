/**
 * Leaderboard Utilities
 * Helper functions for leaderboard operations
 */

import type { FighterRow, TrainerRow, ActivityRow } from "@/types/leaderboard";

// ============================================
// Data Transformation Utilities
// ============================================

/**
 * Rotates an array by shifting elements
 * @param rows - Array to rotate
 * @param shift - Number of positions to shift
 * @returns Rotated array
 */
export function rotate<T>(rows: T[], shift: number): T[] {
  const clone = [...rows];
  return [...clone.slice(shift), ...clone.slice(0, shift)];
}

/**
 * Creates time-filtered data by rotating base data
 * @param baseData - Base data array
 * @param timeFilters - Array of time filter names
 * @returns Record mapping time filters to rotated data
 */
export function createTimeFilteredData<T extends { rank: number }>(
  baseData: T[],
  timeFilters: readonly string[]
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  
  timeFilters.forEach((filter, index) => {
    if (index === 0) {
      // First filter uses original data
      result[filter] = baseData;
    } else {
      // Other filters use rotated data
      const rotated = rotate(baseData, index);
      result[filter] = rotated.map((row, idx) => ({
        ...row,
        rank: idx + 1,
      }));
    }
  });
  
  return result as Record<string, T[]>;
}

// ============================================
// Fighter Image Utilities
// ============================================

/**
 * Mapping of fighter names to leaderboard image numbers
 */
const FIGHTER_IMAGE_MAP: Record<string, string> = {
  "ERNEST": "48",
  "SILVAA": "34",
  "ATHENA": "49",
  "DASHA": "39",
  "YOON": "41",
  "MARGOT": "10",
  "DEATH PUNCH": "05",
  "VIKTOR R.": "42",
  "HER ERA": "51",
  "FISTFUL THUNDER": "26",
  "KAT": "02",
  "BLAZIN": "08",
  "PRISCILLA": "40",
  "XIA": "12",
  "MAGPIE": "36",
  "HADES": "28",
  "IRON": "52",
  "SOIR": "30",
  "ACHILLIA": "11",
  "ZARA STEELE": "22",
  "RED THE MAD": "17",
  "RAGE": "50",
  "SERAPHYM": "25",
  "9LIVES": "20",
  "ROBIN": "24",
  "TOBIASSA": "27",
  "ADA": "38",
  "LYNX": "29",
  "BARAKA": "31",
  "CHAEWON": "23",
  "POLLO SALVAJE": "09",
  "KILLER KIM": "06",
  "ROGUE": "14",
  "XENA": "46",
  "BILLY": "21",
  "SU": "35",
  "THE THRONEKEEPER": "45",
  "BOB": "03",
  "FLIGHTRESS": "43",
  "DEVIL PUNCH": "15",
  "HELLRAISER": "18",
  "KIND KID": "47",
  "LORD NEUTRON": "07",
  "VIOLET": "16",
  "MIYATA": "44",
  "SKILUX": "04",
  "STAR BREAKER": "01",
  "STARLA": "19",
  "TYRANTUS": "32",
  "ASENA KAYA": "37",
  "FAE": "13",
};

/**
 * Gets the leaderboard image path for a fighter
 * @param name - Fighter name (e.g., "FAE #33")
 * @returns Path to the fighter's leaderboard image
 */
export function getFighterImage(name: string): string {
  // Extract fighter name without the #number part
  const fighterName = name.split(" #")[0].trim();
  
  const imageNum = FIGHTER_IMAGE_MAP[fighterName] || "01"; // Default to 01.jpg if not found
  return `/assets/leaderboard/${imageNum.padStart(2, "0")}.jpg`;
}

/**
 * Extracts fighter name without the token number
 * @param fullName - Full fighter name (e.g., "FAE #33")
 * @returns Fighter name without token number
 */
export function getFighterName(fullName: string): string {
  return fullName.split(" #")[0].trim();
}

// ============================================
// Display Formatting Utilities
// ============================================

/**
 * Formats rank display with emoji for top 3
 * @param rank - Rank number
 * @returns Formatted rank string with emoji
 */
export function formatRankDisplay(rank: number): string {
  if (rank === 1) return " 🥇   1";
  if (rank === 2) return "  🥈  2";
  if (rank === 3) return "   🥉 3";
  return `    ${rank}`;
}

/**
 * Checks if a delta value indicates positive change
 * @param delta - Delta string (e.g., "+21.5", "+0", "-5")
 * @returns True if delta is positive and not zero
 */
export function isPositiveDelta(delta: string | undefined): boolean {
  if (!delta) return false;
  return delta !== "+0" && parseFloat(delta) > 0;
}

