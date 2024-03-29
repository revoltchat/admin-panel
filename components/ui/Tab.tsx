import { ReactNode } from "react";

import { Flex, Tabs } from "@radix-ui/themes";

export function Tab({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) {
  return (
    <Tabs.Content value={value}>
      <Flex gap="2" direction="column" className="pt-2">
        {children}
      </Flex>
    </Tabs.Content>
  );
}
