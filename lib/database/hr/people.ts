import { createCollectionFn } from "..";

import type { Hr } from ".";

const peopleCol = createCollectionFn<Hr["Person"]>("revolt_hr", "people");

/**
 * Fetch person given the query
 * @param query Person ID or Email
 * @returns Person or nothing
 */
export function fetchPerson(query: { _id: string } | { email: string }) {
  return peopleCol().findOne(query);
}
