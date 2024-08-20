"use server";

import { getScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_COMMENT_CREATE } from "@/lib/auth/rbacInternal";
import { createChangelog } from "@/lib/core";
import { ChangeLogDocument, changelog } from "@/lib/db/types";

export async function getChangelogEntries(objectId: string) {
  return await changelog().find({ "object.id": objectId }).toArray();
}

export async function createComment(
  object: ChangeLogDocument["object"],
  text: string,
) {
  const userEmail = await getScopedUser(RBAC_PERMISSION_COMMENT_CREATE);

  return await createChangelog(userEmail, {
    object,
    type: "comment",
    text,
  } as never); // TOOD: fix typing
}
