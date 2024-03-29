"use client";

import { ReasonButton } from "@/components/ui/ReasonButton";
import { User } from "revolt-api";

import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Badge, Flex } from "@radix-ui/themes";

export async function AuxiliaryEvidenceForUser({ user }: { user: User }) {
  return (
    <Flex
      gap="2"
      className="overflow-x-scroll min-w-0"
      style={{
        // scrollbarWidth: "thin",
        // scrollbarColor: "gray transparent",
        scrollbarWidth: "none",
      }}
    >
      <ReasonButton onConfirm={() => void 0}>
        <Badge color="gray">
          <Cross2Icon /> Messages
        </Badge>
      </ReasonButton>
      {/*<Badge color="iris">
        <CheckIcon /> Messages
      </Badge>*/}

      {/*<Badge color="gray">
      <Cross2Icon /> Servers
    </Badge>
    <Badge color="gray">
      <Cross2Icon /> Social Graph
    </Badge>
    <Badge color="gray">
      <Cross2Icon /> Authifier
    </Badge>*/}
    </Flex>
  );
}
