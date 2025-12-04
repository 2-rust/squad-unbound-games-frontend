/**
 * Application Constants
 * Centralized constants for the entire application
 */

// ============================================
// Training & Game Constants
// ============================================

/** Number of days a Strava connection remains valid */
export const STRAVA_CONNECTION_VALIDITY_DAYS = 30;

/** Maximum distance (in km) that can be applied per fighter per cycle */
export const MAX_DISTANCE_PER_FIGHTER = 20;

/** Maximum number of syncs allowed per day */
export const DAILY_SYNC_LIMIT = 20;

/** Default number of syncs remaining when reset */
export const DEFAULT_SYNCS_REMAINING = 20;

// ============================================
// Application Configuration
// ============================================

/** Default application URL for OAuth redirects */
export const DEFAULT_APP_URL = "https://squad-unbound-games.vercel.app";

// ============================================
// Default Attribute Values
// ============================================

/**
 * Default attribute values for fighters
 * These are used when no actual attribute data is available
 */
export const DEFAULT_ATTRIBUTE_VALUES: Record<string, number> = {
  punch: 92,
  endurance: 85,
  speed: 83,
  defense: 66,
  technique: 73,
  mental: 84,
  intelligence: 88,
  charisma: 91,
  stealth: 84,
  leadership: 90,
  agility: 86,
  luck: 89,
} as const;

// ============================================
// Re-export UI Constants
// ============================================

export * from "./ui";
