import { createCollectionFn } from "..";

import type { Hr } from ".";

const roleCol = createCollectionFn<Hr["Role"]>("revolt_hr", "roles");

/**
 * Fetch roles by IDs
 * @param ids IDs
 * @returns Roles
 */
export function fetchRoles(ids: string[]) {
  return roleCol()
    .find({ _id: { $in: ids } })
    .toArray();
}
