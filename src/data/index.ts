/**
 * Application Data
 * Configuration data, mock data, and static content for the application
 */

import type { AttributeCard, TrainingMethod, Course, FighterCard } from "@/types";

// ============================================
// Mock/Dummy Data
// ============================================

/**
 * Mock fighter cards for development/testing
 * In production, these are replaced by actual NFT data
 */
export const fighterCards: FighterCard[] = [
  {
    id: "#041",
    name: "Rex Vanguard",
    creator: "Fighters Unbound",
    level: "21",
    rarity: "Legendary",
    boost: "Leadership +9",
    image: "/assets/defaultnft.png",
    isOwned: true,
  },
];

// ============================================
// Configuration Data
// ============================================

/**
 * Available fighter attributes with their metadata
 * Defines all possible attributes that can be trained or displayed
 */
export const attributeOptions: AttributeCard[] = [
  {
    id: "endurance",
    emoji: "🔋",
    title: "Endurance",
    description: "Stamina and resilience over time.",
    status: "Trainable via running (Strava)",
    trainable: true,
  },
  {
    id: "mental",
    emoji: "🪷",
    title: "Mental Strength",
    description: "Focus, discipline and emotional control.",
    status: "Trainable via meditation or yoga",
    trainable: true,
  },
  {
    id: "leadership",
    emoji: "👑",
    title: "Leadership",
    description: "Strategic clarity, initiative and team influence.",
    status: "Trainable via consistent meditation",
    trainable: true,
  },
  {
    id: "agility",
    emoji: "🏹",
    title: "Agility",
    description: "Flexibility, control and body coordination.",
    status: "Trainable via yoga",
    trainable: true,
  },
  {
    id: "punch",
    emoji: "🥊",
    title: "Punch",
    description: "Raw striking power and knockout potential.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "speed",
    emoji: "⚡",
    title: "Speed",
    description: "Reaction time and explosive movement.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "defense",
    emoji: "🛡️",
    title: "Defense",
    description: "Ability to block, evade and absorb attacks.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "technique",
    emoji: "🎯",
    title: "Technique",
    description: "Precision, timing and tactical execution.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "intelligence",
    emoji: "🧠",
    title: "Intelligence",
    description: "Tactical insight and problem-solving under pressure.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "charisma",
    emoji: "😎",
    title: "Charisma",
    description: "Presence, confidence and influence in the arena.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "stealth",
    emoji: "🥷",
    title: "Stealth",
    description: "Mastery of subtlety, movement and misdirection.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "luck",
    emoji: "🍀",
    title: "Luck",
    description: "Chance-based advantages in unpredictable moments.",
    status: "Not trainable yet",
    trainable: false,
  },
];

/**
 * Available training methods
 * Defines the different ways users can train their fighters
 */
export const trainingMethods: TrainingMethod[] = [
  {
    id: "strava",
    icon: "🏃‍♂️",
    title: "Strava",
    description: "Mileage-based XP, synced automatically.",
    badge: "Live",
  },
  {
    id: "meditation",
    icon: "🧘‍♀️",
    title: "Meditation",
    description: "Mindful reps to unlock focus.",
    badge: "Beta",
  },
  {
    id: "yoga",
    icon: "🧘‍♂️",
    title: "Yoga",
    description: "Mobility flows for agility buffs.",
    badge: "Coming Soon",
  },
];

// ============================================
// Course Data
// ============================================

/**
 * Meditation course content
 * Each course includes video ID and timer duration in seconds
 */
export const meditationCourses: Course[] = [
  { 
    id: 1, 
    title: "Lesson One", 
    subtitle: "Focus and Clarity", 
    videoId: "pRjnf0ot0ss", 
    timer: 339 // 5:39
  },
  { 
    id: 2, 
    title: "Lesson Two", 
    subtitle: "Grounding & Clarity", 
    videoId: "J6W6AYsHnT0", 
    timer: 749 // 12:29
  },
  { 
    id: 3, 
    title: "Lesson Three", 
    subtitle: "Calm & Presence", 
    videoId: "hXf2e0XFMPc", 
    timer: 321 // 5:21
  },
  { 
    id: 4, 
    title: "Lesson Four", 
    subtitle: "Breathe & Awareness", 
    videoId: "ECbfqZzIzPA", 
    timer: 736 // 12:16
  },
];

/**
 * Yoga course content
 * Each course includes video ID and timer duration in seconds
 */
export const yogaCourses: Course[] = [
  { 
    id: 1, 
    title: "Lesson One", 
    subtitle: "Between Tension and Technique", 
    videoId: "gb_MGpw7zIs", 
    timer: 669 // 11:09
  },
  { 
    id: 2, 
    title: "Lesson Two", 
    subtitle: "Flow under Pressure", 
    videoId: "XlBUeuWA7Q4", 
    timer: 364 // 6:04
  },
  { 
    id: 3, 
    title: "Lesson Three", 
    subtitle: "Precision and Stillness", 
    videoId: "gHjVLRoYH7s", 
    timer: 796 // 13:16
  },
  { 
    id: 4, 
    title: "Lesson Four", 
    subtitle: "Watchful and Ready", 
    videoId: "MKAjKetmM3M", 
    timer: 504 // 8:24
  },
  { 
    id: 5, 
    title: "Lesson Five", 
    subtitle: "Control the Center", 
    videoId: "_z1qv7W2og0", 
    timer: 545 // 9:05
  },
];
