"use client";

import { useAuthorisedUser } from "@/lib/auth";
import { CaseDocument, ChangeLogDocument } from "@/lib/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Flex,
  Popover,
  TextArea,
  TextField,
} from "@radix-ui/themes";

import { consumeChangelog } from "../changelogs/helpers";

import { setCaseTitle } from "./actions";

export function RenameCase({ id, title }: { id: string; title: string }) {
  const [text, setText] = useState(title);

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async (title: string) => {
      await consumeChangelog(setCaseTitle(id, title));
      return title;
    },
    onSuccess(title) {
      queryClient.setQueryData([id], (data: { cs: CaseDocument }) => ({
        ...data,
        cs: {
          ...data.cs,
          title,
        },
      }));
    },
  });

  return (
    <div className="px-2 py-2 bg-[var(--slate-1)] w-fit">
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" disabled={isPending}>
            Rename
          </Button>
        </Popover.Trigger>
        <Popover.Content style={{ width: 360 }}>
          <Box grow="1">
            <TextField.Input
              value={text}
              placeholder="Write a new title…"
              onChange={(e) => setText(e.currentTarget.value)}
            />
            <Flex gap="3" mt="3">
              <Popover.Close>
                <Button size="1" onClick={() => mutate(text)}>
                  Save
                </Button>
              </Popover.Close>
            </Flex>
          </Box>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
