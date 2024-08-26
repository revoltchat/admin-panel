import { publishPrivate } from "@/lib/events";
import { API } from "revolt.js";
import { ulid } from "ulid";

import { createCollectionFn } from "..";

export type RevoltChannel = API.Channel;

const channelCol = createCollectionFn<RevoltChannel>("revolt", "channels");

/**
 * Create or find existing DM between users
 * @param userA User A
 * @param userB User B
 * @returns DM Channel
 */
export async function createOrFindDM(userA: string, userB: string) {
  let dm = await channelCol().findOne({
    channel_type: "DirectMessage",
    recipients: { $all: [userA, userB] },
  });

  if (!dm) {
    dm = {
      _id: ulid(),
      channel_type: "DirectMessage",
      active: true,
      recipients: [userA, userB],
    };

    await channelCol().insertOne(dm);

    for (const user of [userA, userB])
      await publishPrivate(user, {
        type: "ChannelCreate",
        ...dm,
      });
  }

  return dm;
}
