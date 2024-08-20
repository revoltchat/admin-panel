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
