"use client";

import { Tab } from "@/components/ui/Tab";
import { ReactNode } from "react";
import { Channel, Server } from "revolt-api";

import { Badge, Flex, ScrollArea, Tabs } from "@radix-ui/themes";

import { ServerBrowser } from "./ServerBrowser";

export function ServerInterfaceTabs({
  recentMessages,
  channels,
  categories,
}: {
  recentMessages: ReactNode;
  channels: Record<
    string,
    Channel & { channel_type: "TextChannel" | "VoiceChannel" }
  >;
  categories: Server["categories"];
}) {
  return (
    <Tabs.Root defaultValue="browse">
      <Tabs.List>
        <Tabs.Trigger value="browse">Browse Channels</Tabs.Trigger>
        <Tabs.Trigger value="recent">Recent Messages</Tabs.Trigger>
      </Tabs.List>

      <Tab value="browse">
        <ServerBrowser channels={channels} categories={categories} />
      </Tab>
      <Tab value="recent">
        <ScrollArea type="always" scrollbars="vertical" style={{ height: 360 }}>
          {recentMessages}
        </ScrollArea>
      </Tab>
    </Tabs.Root>
  );
}
