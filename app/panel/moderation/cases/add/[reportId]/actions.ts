"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { createChangelog } from "@/lib/core";
import { cases, reports } from "@/lib/db/types";

export async function setReportCase(caseId: string, reportId: string) {
  const email = await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  const cs = await cases().findOne({ _id: caseId, status: "Open" });
  if (!cs) throw "invalid case";

  const report = await reports().findOneAndUpdate(
    {
      _id: reportId,
      case_id: {
        $exists: false,
      },
    },
    {
      $set: {
        case_id: caseId,
      },
    },
  );

  if (!report) throw "invalid report";

  return createChangelog(email, {
    object: {
      type: "Case",
      id: caseId,
    },
    type: "case/add_report",
    reportId,
  } as never);
}
