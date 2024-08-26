import { createCollectionFn } from "..";

export type Case = {
  _id: string;
  // TODO
};

const casesCol = createCollectionFn<Case>("revolt", "safety_cases");

export function findCaseById(id: string) {
  return casesCol().findOne({ _id: id });
}
