// Side menu will be dynamically generated based on NFT type and training method
export const getSideMenu = (isHellraiser: boolean, trainingMethod?: string) => [
  { id: "first-section", label: `Select ${isHellraiser ? "Hellraiser" : "Fighter"}` },
  { id: "second-section", label: "Training Method" },
  { id: "third-section", label: "Connect Strava" },
  { id: "fourth-section", label: trainingMethod === "strava" ? "Sync Strava" : trainingMethod === "meditation" ? "Meditation Training" : "Yoga Training" },
] as const;

