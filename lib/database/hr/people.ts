import { ulid } from "ulid";

import { createCollectionFn } from "..";

import type { Hr } from ".";

const peopleCol = createCollectionFn<Hr["Person"]>("revolt_hr", "people");

/**
 * Fetch all people
 * @returns People
 */
export function fetchPeople() {
  return peopleCol()
    .find(
      {},
      {
        projection: {
          approvalRequest: 0,
        },
        sort: {
          name: 1,
        },
      },
    )
    .toArray();
}

/**
 * Fetch all people pending approval
 * @returns People
 */
export function fetchPeoplePendingApproval() {
  return peopleCol().find({ status: "Pending" }).toArray();
}

/**
 * Fetch person given the query
 * @param query Person ID or Email
 * @returns Person or nothing
 */
export function fetchPerson(query: { _id: string } | { email: string }) {
  return peopleCol().findOne(query);
}

/**
 * Create a new person
 * @param name Name
 * @param email Email
 * @param reason Reason
 * @param requestee Requestee's email
 */
export async function createPerson(
  name: string,
  email: string,
  reason: string,
  requestee: string,
) {
  await peopleCol().insertOne({
    _id: ulid(),
    name,
    email,
    status: "Pending",
    positions: [],
    roles: [],
    approvalRequest: {
      reason,
      requestee,
    },
  });
}

/**
 * Update a given person and mark them as approved
 * @param _id Person's ID
 */
export async function updatePersonApproved(_id: string) {
  await peopleCol().updateOne(
    {
      _id,
    },
    {
      $set: {
        status: "Active",
      },
      $unset: {
        approvalRequest: 1,
      },
    },
  );
}

/**
 * Delete a given person's approval request
 * @param _id Person's ID
 */
export async function deletePersonRequest(_id: string) {
  await peopleCol().deleteOne({
    _id,
    status: "Pending",
  });
}
