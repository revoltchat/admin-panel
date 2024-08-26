import { ulid } from "ulid";

import { createCollectionFn } from "..";

export type Strike = {
  _id: string;
  user_id: string;
  reason: string;

  case_id?: string;
  type?: "strike" | "suspension" | "ban";
};

const strikesCol = createCollectionFn<Strike>("revolt", "safety_strikes");

export function fetchStrikes(user_id: string) {
  return strikesCol().find({ user_id }).toArray();
}

export async function createStrike(
  user_id: string,
  reason: string,
  type: Strike["type"],
  case_id?: string,
) {
  const strike: Strike = {
    _id: ulid(),
    user_id,
    reason,
    type,
    case_id,
  };

  await strikesCol().insertOne(strike);
  return strike;
}
