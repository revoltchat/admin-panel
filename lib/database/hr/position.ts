import { createCollectionFn } from "..";

import type { Hr } from ".";

const positionsCol = createCollectionFn<Hr["Position"]>(
  "revolt_hr",
  "positions",
);

/**
 * Fetch positions by IDs
 * @param ids IDs
 * @returns Positions
 */
export function fetchPositions(ids: string[]) {
  return positionsCol()
    .find({ _id: { $in: ids } })
    .toArray();
}
