import Revolt from "revolt-nodejs-bindings";
import { API } from "revolt.js";

import { callProcedure, createCollectionFn } from "..";

export type RevoltChannel = API.Channel;

const channelCol = createCollectionFn<RevoltChannel>("revolt", "channels");

/**
 * Create or find existing DM between users
 * @param userA User A
 * @param userB User B
 * @returns DM Channel
 */
export async function createOrFindDM(userA: string, userB: string) {
  return callProcedure(Revolt.proc_channels_create_dm, userA, userB);
}
