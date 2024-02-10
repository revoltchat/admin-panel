import { Metadata } from "next";

import { Flex, Heading } from "@radix-ui/themes";

/**
 * Render the page title
 */
export function PageTitle({ metadata }: { metadata: Metadata }) {
  return (
    <Flex className="h-14 items-center">
      <Heading size="8">{metadata.title as string}</Heading>
    </Flex>
  );
}
