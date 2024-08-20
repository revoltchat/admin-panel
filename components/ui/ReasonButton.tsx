import { ReactNode, useState } from "react";

import { Box, Button, Flex, Popover, TextArea } from "@radix-ui/themes";

export function ReasonButton({
  children,
  onConfirm,
}: {
  children: ReactNode;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState<string>();

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <Box flexGrow="1">
          <TextArea
            onChange={(e) => setReason(e.currentTarget.value)}
            placeholder="Write a reason…"
            style={{ height: 80 }}
          />
          <Flex gap="3" mt="3">
            <Popover.Close>
              <Button size="1" onClick={() => reason && onConfirm(reason)}>
                Confirm
              </Button>
            </Popover.Close>
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
}
