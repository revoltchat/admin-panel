"use client";

import { useAuthorisedUser } from "@/lib/auth/user";
import { ChangeLogDocument } from "@/lib/db/types";
import { useState } from "react";

import { Avatar, Box, Button, Flex, Popover, TextArea } from "@radix-ui/themes";

import { createComment } from "./actions";
import { consumeChangelog } from "./helpers";

export function WriteComment({
  object,
}: {
  object: ChangeLogDocument["object"];
}) {
  const { name, image } = useAuthorisedUser();
  const [text, setText] = useState("");

  return (
    <div className="px-2 py-2 bg-[var(--slate-1)] w-fit">
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost">Leave a comment</Button>
        </Popover.Trigger>
        <Popover.Content style={{ width: 360 }}>
          <Flex gap="3">
            <Avatar size="2" src={image} fallback={name[0]} radius="full" />
            <Box flexGrow="1">
              <TextArea
                placeholder="Write a comment…"
                onChange={(e) => setText(e.currentTarget.value)}
                style={{ height: 120 }}
              />
              <Flex gap="3" mt="3">
                <Popover.Close>
                  <Button
                    size="1"
                    onClick={() =>
                      consumeChangelog(createComment(object, text))
                    }
                  >
                    Comment
                  </Button>
                </Popover.Close>
              </Flex>
            </Box>
          </Flex>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
