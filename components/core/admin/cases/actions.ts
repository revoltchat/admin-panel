"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { createChangelog, sendPlatformAlert } from "@/lib/core";
import { TYPES_PROBLEM_WITH_CASE_KEYS } from "@/lib/db/enums";
import { CaseDocument, cases, reports } from "@/lib/db/types";

export async function setCaseCategory(
  id: string,
  category: CaseDocument["category"],
) {
  const userEmail = await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);
  await cases().updateOne({ _id: id }, { $set: { category } });
  return await createChangelog(userEmail, {
    object: {
      type: "Case",
      id,
    },
    type: "case/categorise",
    category,
  } as never);
}

export async function sendCaseNotification(
  id: string,
  userIds: string[],
  content: string,
) {
  if (userIds.length === 0) throw "no users";
  if (content.trim().length === 0) throw "no content";

  const userEmail = await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);
  const cs = await cases().findOne({ _id: id });
  if (!cs) throw "invalid case";

  const message = `**Case ${id.substring(18, 26)}**: ${cs.title}\n${content}`;

  for (const userId of userIds) {
    await sendPlatformAlert(userId, message);
  }

  return await createChangelog(userEmail, {
    object: {
      type: "Case",
      id,
    },
    type: "case/notify",
    userIds,
    content,
  } as never);
}

export async function setCaseStatus(
  id: string,
  status: CaseDocument["status"],
) {
  const userEmail = await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);
  const cs = await cases().findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status,
        ...(status === "Closed"
          ? {
              closed_at: new Date(),
            }
          : {}),
      },
    },
  );

  if (!cs) throw "invalid case";

  await reports().updateMany(
    { case_id: id },
    {
      $set:
        status === "Closed"
          ? TYPES_PROBLEM_WITH_CASE_KEYS.includes(cs.category[0] as never)
            ? {
                status: "Rejected",
                rejection_reason: cs.category[0],
                closed_at: new Date().toISOString(),
              }
            : { status: "Resolved", closed_at: new Date().toISOString() }
          : { status: "Created" },
    },
  );

  return await createChangelog(userEmail, {
    object: {
      type: "Case",
      id,
    },
    type: "case/status",
    status,
  } as never);
}

export async function setCaseTitle(id: string, title: string) {
  const userEmail = await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  await cases().updateOne(
    { _id: id },
    {
      $set: {
        title,
      },
    },
  );

  return await createChangelog(userEmail, {
    object: {
      type: "Case",
      id,
    },
    type: "case/title",
    title,
  } as never);
}
