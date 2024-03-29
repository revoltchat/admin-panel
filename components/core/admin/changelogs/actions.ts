"use server";

import { useScopedUser } from "@/lib/auth";
import { createChangelog } from "@/lib/core";
import { ChangeLogDocument, changelog } from "@/lib/db/types";

export async function getChangelogEntries(objectId: string) {
  return await changelog().find({ "object.id": objectId }).toArray();
}

export async function createComment(
  object: ChangeLogDocument["object"],
  text: string,
) {
  const userEmail = await useScopedUser("comment");

  return await createChangelog(userEmail, {
    object,
    type: "comment",
    text,
  } as never); // TOOD: fix typing
}
