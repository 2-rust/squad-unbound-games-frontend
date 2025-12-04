/**
 * AttributeWithDelta Component
 * Displays an attribute value with optional delta indicator
 */

import { isPositiveDelta } from "@/utils/leaderboard";

type AttributeWithDeltaProps = {
  value: number | string;
  delta?: string;
  dataLabel?: string;
};

export function AttributeWithDelta({ value, delta, dataLabel }: AttributeWithDeltaProps) {
  return (
    <td data-label={dataLabel}>
      {value}
      {delta && (
        <span className={isPositiveDelta(delta) ? "leaderboard-positive-delta" : ""}>
          {" "}({delta})
        </span>
      )}
    </td>
  );
}

