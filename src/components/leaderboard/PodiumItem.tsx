/**
 * PodiumItem Component
 * Displays a single podium position (1st, 2nd, or 3rd)
 */

import { ImageWithFallback } from "./ImageWithFallback";
import { getFighterName } from "@/utils/leaderboard";
import type { FighterRow } from "@/types/leaderboard";
import { DEFAULT_NFT_IMAGE, PODIUM_RANK_EMOJIS, PODIUM_PLACE_NAMES } from "@/constants/leaderboard";

type PodiumItemProps = {
  fighter: FighterRow | undefined;
  rank: 1 | 2 | 3;
  className: string;
};

export function PodiumItem({ fighter, rank, className }: PodiumItemProps) {
  if (!fighter) return null;

  return (
    <div className={className}>
      <div className="leaderboard-podium-rank">{PODIUM_RANK_EMOJIS[rank]}</div>
      <ImageWithFallback
        alt={fighter.name || `${PODIUM_PLACE_NAMES[rank]} Place`}
        className="leaderboard-podium-image"
        src={fighter.image || DEFAULT_NFT_IMAGE}
      />
      <div className="leaderboard-podium-name">{getFighterName(fighter.name)}</div>
    </div>
  );
}

