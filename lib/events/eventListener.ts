import type { RedisClientType } from "redis";
import type { ProtocolV1 } from "revolt.js/lib/events/v1";

import { newRedis } from ".";

/**
 * @deprecated Seems to duplicate listeners during resubscriptions.
 */
export abstract class RedisEventListener {
  client: RedisClientType = null!;
  subscribed = new Set<string>();

  async init(initialTopics: string[]) {
    this.client = (await newRedis()) as RedisClientType;
    this.client.on("error", (err) =>
      console.error("Redis encountered an error:", err),
    );

    for (const topic of initialTopics) {
      await this.client.subscribe(topic, (message) =>
        this.handle(JSON.parse(message)),
      );
    }
  }

  async setTopics(topics: string[]) {
    const newSubscribed = new Set();
    for (const topic of topics) {
      newSubscribed.add(topic);
      this.subscribed.delete(topic);

      if (!this.subscribed.has(topic)) {
        await this.client.subscribe(topic, (message) =>
          this.handle(JSON.parse(message)),
        );
      }
    }

    for (const oldTopic of this.subscribed) {
      await this.client.unsubscribe(oldTopic);
    }
  }

  abstract handle(event: ProtocolV1["server"]): void;
}
