"use server";

import { getScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { createChangelog } from "@/lib/core";
import { suspendUser } from "@/lib/database/revolt";
import { createOrFindDM } from "@/lib/database/revolt/channels";
import { sendMessage } from "@/lib/database/revolt/messages";
import { findCaseById } from "@/lib/database/revolt/safety_cases";
import { createStrike } from "@/lib/database/revolt/safety_strikes";

export async function strikeUser(
  userId: string,
  type: "strike" | "suspension" | "ban",
  reason: string[],
  context: string,
  caseId: string | undefined,
  duration: "7" | "14" | "indefinite",
) {
  const userEmail = await getScopedUser(RBAC_PERMISSION_MODERATION_AGENT);
  if (caseId && !(await findCaseById(caseId))) throw "Case doesn't exist?";

  const strike = await createStrike(
    userId,
    reason.join(", ") +
      (type === "suspension"
        ? ` (${duration === "indefinite" ? duration : `${duration} day`})`
        : "") +
      (context ? ` - ${context}` : ""),
    type,
    caseId,
  );

  const changelog = await createChangelog(userEmail, {
    object: {
      type: "User",
      id: userId,
    },
    ...(type === "strike"
      ? {
          type: "user/strike",
          id: strike._id,
          reason,
        }
      : type === "suspension"
        ? {
            type: "user/suspend",
            id: strike._id,
            duration,
            reason,
          }
        : {
            type: "user/ban",
            id: strike._id,
            reason,
          }),
  });

  if (type === "suspension") {
    await suspendUser(
      userId,
      duration === "indefinite" ? 0 : parseInt(duration),
      reason,
    );
  }

  if (type !== "ban") {
    const channel = await createOrFindDM(
      userId,
      process.env.PLATFORM_ACCOUNT_ID!,
    );

    await sendMessage(channel._id, {
      content: [
        type === "suspension"
          ? "Your account has been suspended, for one or more reasons:"
          : "You have received an account strike, for one or more reasons:",
        ...reason.map((r) => `- ${r}`),
        "",
        type === "suspension"
          ? "Further violations may result in a permanent ban depending on severity, please abide by the [Acceptable Usage Policy](https://revolt.chat/aup)."
          : "Further violations will result in suspension or a permanent ban depending on severity, please abide by the [Acceptable Usage Policy](https://revolt.chat/aup).",
        ...(caseId
          ? ["", `Case ID for your reference: **${caseId.substring(18)}**`]
          : ""),
        "If you have further questions about this strike, please contact abuse@revolt.chat",
      ].join("\n"),
    });
  }

  return { changelog, strike };
}
