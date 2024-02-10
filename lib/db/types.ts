import {
  Channel,
  Member,
  Message,
  ReportedContent,
  Server,
  User,
} from "revolt-api";
import { col } from ".";

export type CaseDocument = {
  _id: string;
  title: string;
  notes?: string;
  author: string;
  status: "Open" | "Closed";
  closed_at?: string;
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
} & (
  | { status: "Created" }
  | ({
      type: "Rejected" | "Resolved";
      closed_at?: string;
    } & (
      | { type: "Rejected"; rejection_reason?: string }
      | { type: "Resolved" }
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
    "accounts"
  );
}

/**
 * Use `sessions` collection
 */
export function sessions() {
  return col<{ _id: string; user_id: string }>("sessions");
}
