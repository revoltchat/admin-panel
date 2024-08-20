"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { col } from "@/lib/db";
import { CaseDocument, ReportDocument } from "@/lib/db/types";
import { API } from "revolt.js";

export type SearchResult = {
  id: string;
  type: "user" | "channel" | "server" | "message" | "report" | "case";
  title: string;
  iconURL?: string;
  link: string;
};

function userToResult(
  id: string,
  user?: API.User,
  email?: string,
): SearchResult {
  return {
    id,
    type: "user",
    title: (user ? user.username + "#" + user.discriminator : email)!,
    // TODO hard link
    iconURL: user
      ? user.avatar
        ? `https://autumn.revolt.chat/avatars/${user.avatar._id}`
        : `https://api.revolt.chat/users/${user._id}/default_avatar`
      : undefined,
    link: `/panel/revolt/inspect/user/${id}`,
  };
}

function channelDisplayName(channel: API.Channel) {
  switch (channel.channel_type) {
    default:
      return "Channel";
  }
}

function channelToResult(channel: API.Channel): SearchResult {
  return {
    id: channel._id,
    type: "channel",
    title: channelDisplayName(channel),
    // TODO: hard link
    iconURL: (channel as any).icon
      ? `https://autumn.revolt.chat/icons/${(channel as any).icon._id}`
      : "",
    link: `/panel/revolt/inspect/channel/${channel._id}`,
  };
}

function serverToResult(server: API.Server): SearchResult {
  return {
    id: server._id,
    type: "server",
    title: server.name,
    // TODO: hard link
    iconURL: (server as any).icon
      ? `https://autumn.revolt.chat/icons/${(server as any).icon._id}`
      : "",
    link: `/panel/revolt/inspect/server/${server._id}`,
  };
}

function reportDisplayName(report: ReportDocument) {
  return `${(report.additional_context || "No reason specified.")
    .trim()
    .replace(
      /\s+/g,
      " ",
    )} · ${report.content.report_reason} ${report.content.type}`;
}

export async function search(thing: string) {
  await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  const results: SearchResult[] = [];

  // If containing @, try match email to user/account
  if (thing.includes("@")) {
    const account = await col<{ _id: string; email: string }>(
      "accounts",
    ).findOne(
      {
        $or: [{ email: thing }, { email_normalised: thing }],
      },
      {
        collation: {
          locale: "en",
          strength: 2,
        },
      },
    );

    if (account) {
      const user = await col<API.User>("users").findOne({
        _id: account._id,
      });

      results.push(userToResult(account._id, user as API.User, account.email));
    }

    return results; // can't match anything else
  }

  // Lookup user/account by username, username#tag
  if (thing.includes("#")) {
    await col<API.User>("users")
      .findOne(
        {
          username: thing.split("#").shift(),
          discriminator: thing.split("#").pop(),
        },
        {
          collation: {
            locale: "en",
            strength: 2,
          },
        },
      )
      .then((user) => user && results.push(userToResult(user._id, user)));

    return results; // can't match anything else
  } else {
    await col<API.User>("users")
      .find(
        {
          username: thing,
        },
        {
          collation: {
            locale: "en",
            strength: 2,
          },
        },
      )
      .toArray()
      .then((users) =>
        users.forEach((user) => results.push(userToResult(user._id, user))),
      );
  }

  // Match IDs for objects: user/account, channel, server, message
  if (thing.length === 26)
    await Promise.all([
      col<API.User>("users")
        .findOne({
          _id: thing,
        })
        .then((user) => user && results.push(userToResult(user._id, user))),
      col<API.Channel>("channels")
        .findOne({
          _id: thing,
          channel_type: {
            $ne: "SavedMessages",
          },
        })
        .then((chn) => chn && results.push(channelToResult(chn))),
      col<API.Server>("servers")
        .findOne({
          _id: thing,
        })
        .then((srv) => srv && results.push(serverToResult(srv))),
      col<API.Message>("messages")
        .findOne({
          _id: thing,
        })
        .then(async (msg) => {
          if (msg) {
            const author = await col<API.User>("users").findOne({
              _id: msg.author,
            });

            const user = userToResult("", author as API.User, "Unknown User");

            results.push({
              type: "message",
              id: msg._id,
              title: `${user.title}:${msg.attachments ? " (with attachments)" : ""} ${msg.content?.substring(0, 32)}${(msg.content?.length ?? 0) > 32 ? "..." : ""}`,
              iconURL: user.iconURL,
              link: `/panel/revolt/inspect/message/${msg._id}`,
            });
          }
        }),
    ]);

  // Match IDs for reports, cases,
  // partial report IDs (last 6 chars),
  // partial case IDs (last 8 chars)
  if (thing.length === 26 || thing.length === 6)
    col<ReportDocument>("safety_reports")
      .find({
        // TODO: no sanitisation into regexp, can inject arbitrary queries
        _id: thing.length === 26 ? thing : new RegExp(`${thing}$`),
      })
      .toArray()
      .then((reports) =>
        reports.forEach((report) =>
          results.push({
            id: report._id,
            type: "report",
            title: reportDisplayName(report),
            link: `https://admin.revolt.chat/panel/reports/${report._id}`,
          }),
        ),
      );

  if (thing.length === 26 || thing.length === 8)
    await col<CaseDocument>("safety_cases")
      .find({
        // TODO: no sanitisation into regexp, can inject arbitrary queries
        _id: thing.length === 26 ? thing : new RegExp(`${thing}$`),
      })
      .toArray()
      .then((cases) =>
        cases.forEach((entry) =>
          results.push({
            id: entry._id,
            type: "case",
            title: entry.title,
            link: `/panel/mod/legacy/cases/${entry._id}`,
          }),
        ),
      );

  // Match server invite
  const invite = await col<API.Invite>("channel_invites").findOne({
    _id: thing,
  });

  if (invite) {
    switch (invite.type) {
      case "Server":
        await col<API.Server>("servers")
          .findOne({
            _id: invite.server,
          })
          .then((server) => server && results.push(serverToResult(server)));
        break;
      case "Group":
        await col<API.Channel>("channels")
          .findOne({
            _id: invite.channel,
          })
          .then((channel) => channel && results.push(channelToResult(channel)));
        break;
    }
  }

  return results;
}
