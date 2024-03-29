"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

/**
 * Display message when there is no data to display
 */
export function NoEntries() {
  return (
    <Callout.Root>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>Nothing here yet!</Callout.Text>
    </Callout.Root>
  );
}
