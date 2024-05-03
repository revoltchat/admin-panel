"use client";

import { Hr } from "@/lib/database";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button, Text, TextField } from "@radix-ui/themes";

import { approveTeamMember } from "./actions";

export function ApproveTeamMember({ person }: { person: Hr["Person"] }) {
  const [hide, setHide] = useState(false);
  const [name, setName] = useState(person.name);
  const [email, setEmail] = useState(person.email);

  const { isPending, error, isError, mutate } = useMutation({
    mutationFn: async (approve: boolean) => {
      await approveTeamMember(person._id, approve);
      setHide(true);
    },
  });

  if (hide) return null;

  return (
    <form
      className="select-none"
      onSubmit={(e) => {
        e.preventDefault();
        mutate(true);
      }}
    >
      <div className="max-w-[320px] flex flex-col gap-2">
        <Text size="2" as="label">
          Name{" "}
          <TextField.Input
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </Text>
        <Text size="2" as="label">
          Requested Identifier{" "}
          <TextField.Root>
            <TextField.Input
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value.toLowerCase())}
            />
          </TextField.Root>
        </Text>
        <Text size="2">
          <Text weight="bold">Requestee:</Text>{" "}
          {person.approvalRequest?.requestee}
        </Text>
        <Text size="2">
          <Text weight="bold">Reason:</Text> {person.approvalRequest?.reason}
        </Text>
        <div className="flex gap-2 items-center">
          <Button color="green" type="submit" disabled={isPending}>
            Approve
          </Button>
          <Button
            color="red"
            disabled={isPending}
            onClick={(e) => {
              e.stopPropagation();
              mutate(false);
            }}
          >
            Reject
          </Button>
          {isError && <Text color="red">{String(error)}</Text>}
        </div>
      </div>
    </form>
  );
}
