import { createCollectionFn } from "..";

import type { Hr } from ".";

const peopleCol = createCollectionFn<Hr["Person"]>("revolt_hr", "people");

/**
 * Fetch all people
 * @returns People
 */
export function fetchPeople() {
  return peopleCol().find().toArray();
}

/**
 * Fetch person given the query
 * @param query Person ID or Email
 * @returns Person or nothing
 */
export function fetchPerson(query: { _id: string } | { email: string }) {
  return peopleCol().findOne(query);
}
