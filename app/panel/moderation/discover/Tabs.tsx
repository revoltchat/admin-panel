"use client";

import { Tab } from "@/components/ui/Tab";
import { ReactNode } from "react";

import { Badge, Flex, Tabs } from "@radix-ui/themes";

export function DiscoverTabs({
  stats,
  requests,
  requestCount,
}: {
  stats: ReactNode;
  requests: ReactNode;
  requestCount: number;
}) {
  return (
    <Tabs.Root defaultValue="stats">
      <Tabs.List>
        <Tabs.Trigger value="stats">Overview</Tabs.Trigger>
        <Tabs.Trigger value="servers">Servers</Tabs.Trigger>
        <Tabs.Trigger value="bots">Bots</Tabs.Trigger>
        <Tabs.Trigger value="requests">
          <Flex gap="2">
            Requests
            {requestCount && <Badge color="red">{requestCount}</Badge>}
          </Flex>
        </Tabs.Trigger>
      </Tabs.List>

      <Tab value="stats">{stats}</Tab>
      <Tab value="servers">not implemented yet</Tab>
      <Tab value="bots">not implemented yet</Tab>
      <Tab value="requests">{requests}</Tab>
    </Tabs.Root>
  );
}
