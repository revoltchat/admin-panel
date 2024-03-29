"use server";

import { useScopedUser } from "@/lib/auth";
import { createChangelog, sendPlatformAlert } from "@/lib/core";
import { adminDiscoverRequests, bots, servers, users } from "@/lib/db/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export async function approve(id: string, silent: boolean) {
  const email = await useScopedUser("discover.requests.approve");
  const request = await adminDiscoverRequests().findOne({ _id: id });
  if (!request) throw "Unknown request.";

  const nextGen = new Date();
  nextGen.setHours(Math.floor(nextGen.getHours() / 6 + 1) * 6);

  if (request.type === "Server") {
    await createChangelog(email, {
      type: "server/discover/approve",
      object: {
        type: "Server",
        id: request.serverId,
      },
    });

    await servers().updateOne(
      {
        _id: id,
      },
      {
        $set: {
          discoverable: true,
          analytics: true,
        },
      },
    );

    const { name, owner } = (await servers().findOneAndUpdate(
      {
        _id: request.serverId,
      },
      {
        $set: {
          discoverable: true,
          analytics: true,
        },
      },
    ))!;

    if (!silent) {
      await sendPlatformAlert(
        owner,
        `Your Discover listing request for ${name} has been approved.\nRankings will next regenerate ${dayjs(nextGen).fromNow()}.`,
      );
    }
  } else {
    await createChangelog(email, {
      type: "bot/discover/approve",
      object: {
        type: "Bot",
        id: request.botId,
      },
    });

    await bots().updateOne(
      {
        _id: request.botId,
      },
      {
        $set: {
          discoverable: true,
          analytics: true,
        },
      },
    );

    const { username, discriminator, bot } = (await users().findOne({
      _id: request.botId,
    }))!;

    if (!silent) {
      await sendPlatformAlert(
        bot!.owner,
        `Your Discover listing request for ${username}#${discriminator} has been approved.\nRankings will next regenerate ${dayjs(nextGen).fromNow()}.`,
      );
    }
  }

  await adminDiscoverRequests().deleteOne({ _id: id });
}

export async function reject(id: string, reason: string) {
  const email = await useScopedUser("discover.requests.reject");
  const request = await adminDiscoverRequests().findOne({ _id: id });
  if (!request) throw "Unknown request.";

  if (request.type === "Server") {
    await createChangelog(email, {
      type: "server/discover/reject",
      object: {
        type: "Server",
        id: request.serverId,
      },
      reason,
    } as never); // TOOD: fix typing

    if (!reason.startsWith("(silent)")) {
      const { name, owner } = (await servers().findOne({
        _id: request.serverId,
      }))!;

      await sendPlatformAlert(
        owner,
        `Your Discover listing request for ${name} has been rejected for "${reason}".`,
      );
    }
  } else {
    await createChangelog(email, {
      type: "bot/discover/reject",
      object: {
        type: "Bot",
        id: request.botId,
      },
      reason,
    } as never); // TOOD: fix typing

    if (!reason.startsWith("(silent)")) {
      const { username, discriminator, bot } = (await users().findOne({
        _id: request.botId,
      }))!;

      await sendPlatformAlert(
        bot!.owner,
        `Your Discover listing request for ${username}#${discriminator} has been rejected for "${reason}".`,
      );
    }
  }

  await adminDiscoverRequests().deleteOne({ _id: id });
}
