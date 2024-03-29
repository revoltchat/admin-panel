"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { fetchMessages } from "@/lib/core";
import { col } from "@/lib/db";

export async function fetchMessagesInChannel(channelId: string) {
  await useScopedUser("*");
  // TODO: access token

  return await fetchMessages({ channel: channelId });
}

export async function undeleteAttachment(attachmentId: string) {
  await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);
  await col<{ _id: string }>("attachments").updateOne(
    { _id: attachmentId, reported: true, deleted: true },
    { $set: { temporaryAccess: true }, $unset: { deleted: 1 } },
  );
}

export async function redeleteAttachment(attachmentId: string) {
  await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);
  await col<{ _id: string }>("attachments").updateOne(
    {
      _id: attachmentId,
      reported: true,
      temporaryAccess: true,
    },
    { $set: { deleted: true }, $unset: { temporaryAccess: true } },
  );
}
