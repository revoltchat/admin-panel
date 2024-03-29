"use client";

import { CircleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

/**
 * Display message when data is loading
 */
export function Loading() {
  return (
    <Callout.Root>
      <Callout.Icon>
        <CircleIcon />
      </Callout.Icon>
      <Callout.Text>Loading data...</Callout.Text>
    </Callout.Root>
  );
}
