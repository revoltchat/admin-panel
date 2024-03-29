"use client";

import { ReasonButton } from "@/components/ui/ReasonButton";
import { DiscoverRequestDocument } from "@/lib/db/types";
import { useRouter } from "next/navigation";

import { Button, Flex } from "@radix-ui/themes";

import { approve, reject } from "./actions";

export function RequestActions({
  request,
}: {
  request: DiscoverRequestDocument;
}) {
  const router = useRouter();

  return (
    <Flex gap="2">
      <Button
        color="green"
        onClick={() =>
          approve(request._id, false).then(() => router.push("/panel/discover"))
        }
      >
        Approve
      </Button>
      <Button
        color="green"
        variant="outline"
        onClick={() =>
          approve(request._id, true).then(() => router.push("/panel/discover"))
        }
      >
        Silently Approve
      </Button>
      <ReasonButton
        onConfirm={(reason) =>
          reject(request._id, reason).then(() => router.push("/panel/discover"))
        }
      >
        <Button color="red">Reject</Button>
      </ReasonButton>
      <ReasonButton
        onConfirm={(reason) =>
          reject(request._id, "(silent) " + reason).then(() =>
            router.push("/panel/discover"),
          )
        }
      >
        <Button color="red" variant="outline">
          Silently Reject
        </Button>
      </ReasonButton>
    </Flex>
  );
}
