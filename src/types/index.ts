export type AttributeCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  status: string;
  trainable: boolean;
};

export type TrainingMethod = {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
};

export type Course = {
  id: number;
  title: string;
  subtitle: string;
  videoId: string;
  timer: number;
};

export type FighterCard = {
  id: string;
  name: string;
  creator: string;
  level: string;
  rarity: string;
  boost: string;
  image: string;
  isOwned: boolean;
};

export type NumericAttribute = {
  name: string;
  value: number;
};

export type SyncResult = {
  distance: number;
  enduranceDelta: number;
  levelDelta: number;
};

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

