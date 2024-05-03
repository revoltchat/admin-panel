"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Checkbox, Text, TextField } from "@radix-ui/themes";

import { createTeamMember } from "./actions";

export function NewTeamMemberForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [outside, setOutside] = useState(false);
  const [reason, setReason] = useState("");

  const { isPending, error, isError, mutateAsync } = useMutation({
    mutationFn: async () => {
      await createTeamMember(
        name,
        outside ? email : `${email}@revolt.chat`,
        reason,
      );
    },
  });

  return (
    <form
      className="select-none"
      onSubmit={(e) => {
        e.preventDefault();
        mutateAsync().then(() => router.push("/panel/hr/team"));
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
              type={outside ? "email" : "text"}
              onChange={(e) => setEmail(e.currentTarget.value.toLowerCase())}
            />
            {!outside && (
              <TextField.Slot className="text-sm">@revolt.chat</TextField.Slot>
            )}
          </TextField.Root>
        </Text>
        <Text size="2" as="label">
          <Checkbox
            checked={outside}
            onCheckedChange={(v) => setOutside(v as boolean)}
          />{" "}
          This is an outside collaborator.
        </Text>
        <Text size="2" as="label">
          Reason{" "}
          <TextField.Input
            required
            value={reason}
            onChange={(e) => setReason(e.currentTarget.value)}
            placeholder="Specify why you are adding this person..."
          />
        </Text>
        <div className="flex gap-2 items-center">
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
          {isError && <Text color="red">{String(error)}</Text>}
        </div>
      </div>
    </form>
  );
}
