import { publish } from "@/lib/events";
import { API } from "revolt.js";
import { ulid } from "ulid";

import { createCollectionFn } from "..";

export type RevoltMessage = API.Message;

const messageCol = createCollectionFn<RevoltMessage>("revolt", "messages");

/**
 * Send a message on the platform
 * @param channelId Channel ID
 * @param message Message details
 * @returns Message created
 */
export async function sendMessage(
  channelId: string,
  message: Omit<RevoltMessage, "_id" | "nonce" | "channel" | "author">,
) {
  const _id = ulid();
  const msg: RevoltMessage = {
    _id,
    nonce: _id,

    author: process.env.PLATFORM_ACCOUNT_ID!,
    channel: channelId,

    ...message,
  };

  await messageCol().insertOne(msg);
  await publish(channelId, {
    type: "Message",
    ...msg,
  });

  return msg;
}
