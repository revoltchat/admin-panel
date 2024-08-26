import {
  Bot,
  Channel,
  Invite,
  Member,
  Message,
  ReportedContent,
  Server,
  User,
} from "revolt-api";

import { col, db } from ".";
import { TYPES_PROBLEM_WITH_CASE, TYPES_VALID_CATEGORY } from "./enums";

export type ChangeLogDocument = {
  _id: string;
  userEmail: string;
} & (
  | ({
      object: {
        type: "Server";
        id: string;
      };
    } & (
      | {
          type: "comment";
          text: string;
        }
      | {
          type: "server/discover/approve";
        }
      | {
          type: "server/discover/reject" | "server/discover/delist";
          reason: string;
        }
    ))
  | ({
      object: {
        type: "Bot";
        id: string;
      };
    } & (
      | {
          type: "comment";
          text: string;
        }
      | {
          type: "bot/discover/approve";
        }
      | {
          type: "bot/discover/reject" | "bot/discover/delist";
          reason: string;
        }
    ))
  | ({
      object: {
        type: "User";
        id: string;
      };
    } & (
      | {
          type: "user/strike";
          id: string;
          reason: string[];
        }
      | {
          type: "user/suspend";
          id: string;
          duration: string;
          reason: string[];
        }
      | {
          type: "user/ban";
          id: string;
          reason: string[];
        }
      | {
          type: "user/export";
          exportType: "law-enforcement";
        }
    ))
  | ({
      object: {
        type: "Case";
        id: string;
      };
    } & (
      | {
          type: "comment";
          text: string;
        }
      | {
          type: "case/categorise";
          category: CaseDocument["category"];
        }
      | {
          type: "case/status";
          status: CaseDocument["status"];
        }
      | {
          type: "case/title";
          title: string;
        }
      | {
          type: "case/add_report";
          reportId: string;
        }
      | {
          type: "case/notify";
          userIds: string;
          content: string;
        }
    ))
);

/**
 * Use `revolt_admin/changelog` collection
 */
export function changelog() {
  return db("revolt_admin").collection<ChangeLogDocument>("changelog");
}

export type CaseDocument = {
  _id: string;
  title: string;
  notes?: string;
  author: string;
  status: "Open" | "Closed";
  category: (
    | keyof typeof TYPES_PROBLEM_WITH_CASE
    | keyof typeof TYPES_VALID_CATEGORY
  )[];
  closed_at?: Date;
};

/**
 * Use `safety_cases` collection
 */
export function cases() {
  return col<CaseDocument>("safety_cases");
}

export type ReportDocument = {
  _id: string;
  author_id: string;
  content: ReportedContent;
  additional_context: string;
  case_id?: string;
  _temp_escalated?: boolean;
} & (
  | { status: "Created" }
  | ({
      status: "Rejected" | "Resolved";
      closed_at?: string;
    } & (
      | { status: "Rejected"; rejection_reason?: string }
      | { status: "Resolved" }
    ))
);

/**
 * Use `safety_reports` collection
 */
export function reports() {
  return col<ReportDocument>("safety_reports");
}

export type SnapshotDocument = {
  _id: string;
  report_id: string;
  content:
    | ({
        _type: "Message";
        _prior_context: Message[];
        _leading_context: Message[];
      } & Message)
    | ({
        _type: "Server";
      } & Server)
    | ({ _type: "User" } & User);
};

/**
 * Use `safety_snapshots` collection
 */
export function snapshots() {
  return col<SnapshotDocument>("safety_snapshots");
}

/**
 * Use `servers` collection
 */
export function servers() {
  return col<Server>("servers");
}

/**
 * Use `invites` collection
 */
export function invites() {
  return col<Invite>("channel_invites");
}

/**
 * Use `analytics/servers` collection
 */
export function serverAnalytics() {
  return db("analytics").collection<{
    _id: string;
    members: number;
    volume: number;
    discoverable: boolean;
  }>("servers");
}

export type DiscoverRequestDocument = {
  _id: string;
} & ({ type: "Server"; serverId: string } | { type: "Bot"; botId: string });

/**
 * Use `revolt_admin/discover_requests` collection
 */
export function adminDiscoverRequests() {
  return db("revolt_admin").collection<DiscoverRequestDocument>(
    "discover_requests",
  );
}

/**
 * Use `bots` collection
 */
export function bots() {
  return col<Bot>("bots");
}

/**
 * Use `analytics/bots` collection
 */
export function botAnalytics() {
  return db("analytics").collection<{
    _id: string;
    servers: number;
    usage: number;
    discoverable: boolean;
  }>("bots");
}

/**
 * Use `channels` collection
 */
export function channels() {
  return col<Channel>("channels");
}

/**
 * Use `users` collection
 */
export function users() {
  return col<User>("users");
}

/**
 * Use `server_members` collection
 */
export function serverMembers() {
  return col<Member>("server_members");
}

/**
 * Use `messages` collection
 */
export function messages() {
  return col<Message>("messages");
}

/**
 * Use `accounts` collection
 */
export function accounts() {
  return col<{ _id: string; email: string; disabled: boolean; spam: boolean }>(
    "accounts",
  );
}

/**
 * Use `sessions` collection
 */
export function sessions() {
  return col<{ _id: string; user_id: string }>("sessions");
}
