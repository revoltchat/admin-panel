"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { cases, reports } from "@/lib/db/types";
import { redirect } from "next/navigation";
import { ulid } from "ulid";

export async function createCase(title: string, reportIds: string[]) {
  const author = await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  const reportSetIds = [...new Set(reportIds)];

  if (
    (await reports().countDocuments({
      _id: { $in: reportSetIds },
      case_id: {
        $exists: 0,
      },
    })) !== reportSetIds.length
  )
    throw "Either invalid report IDs or already assigned to a case.";

  const _id = ulid();
  await cases().insertOne({
    _id,
    author,
    status: "Open",
    title,
    category: [],
  });

  await reports().updateMany(
    {
      _id: { $in: reportSetIds },
    },
    {
      $set: {
        case_id: _id,
      },
    },
  );

  return redirect(`/panel/moderation/cases/${_id}`);
}