import { createClient, RedisClientType } from "@redis/client";
import type { ProtocolV1 } from "revolt.js/lib/events/v1";

export { RedisEventListener } from "./eventListener";

/**
 * Global handle shared in process
 */
let client: RedisClientType;

/**
 * Fetch handle to Redis client
 * @returns Redis client
 */
export async function redis() {
  if (!client) {
    client = createClient({ url: process.env.REDIS! });
    await client.connect();
  }

  return client;
}

/**
 * Create new Redis client
 * @returns Redis client
 */
export async function newRedis() {
  const client = createClient({ url: process.env.REDIS! });
  await client.connect();
  return client;
}

/**
 * Publish a message to Redis
 * @param topic Topic
 * @param message Message
 */
export async function publish(topic: string, message: ProtocolV1["server"]) {
  (await redis()).publish(topic, JSON.stringify(message));
}
