import { RedisClientType, createClient } from "@redis/client";
import { readFile } from "node:fs/promises";
import type { ProtocolV1 } from "revolt.js/lib/events/v1";

export { RedisEventListener } from "./eventListener";

/**
 * Global handle shared in process
 */
let client: RedisClientType;

let certificates: {
  ca: string;
  cert: string;
  key: string;
};

async function getCerts() {
  certificates = {
    ca: await readFile("revolt.crt").then((f) => f.toString()),
    cert: await readFile("client.crt")
      .then((f) => f.toString())
      .catch(() => ""),
    key: await readFile("client.key")
      .then((f) => f.toString())
      .catch(() => ""),
  };

  return certificates;
}

/**
 * Fetch handle to Redis client
 * @returns Redis client
 */
export async function redis() {
  if (!client) {
    const { ca, cert, key } = await getCerts();
    client = createClient({
      url: process.env.REDIS!,
      socket: cert
        ? {
            tls: true,
            ca,
            cert,
            key,
          }
        : undefined,
    });

    await client.connect();
  }

  return client;
}

/**
 * Create new Redis client
 * @returns Redis client
 */
export async function newRedis() {
  const { ca, cert, key } = await getCerts();
  const client = createClient({
    url: process.env.REDIS!,
    socket: cert
      ? {
          tls: true,
          ca,
          cert,
          key,
        }
      : undefined,
  });
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

/**
 * Publish to private topic
 * @param topic Topic
 * @param message Message
 */
export async function publishPrivate(
  topic: string,
  message: ProtocolV1["server"],
) {
  const privateTopic = `${topic}!`;
  await publish(privateTopic, message);
}
