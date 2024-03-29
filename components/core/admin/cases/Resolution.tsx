"use client";

import { reportCategoryTemplateResolutionResponse } from "@/lib/db/enums";
import { CaseDocument } from "@/lib/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { User } from "revolt-api";

import {
  Avatar,
  Button,
  Checkbox,
  Flex,
  Heading,
  Popover,
  Text,
  TextArea,
} from "@radix-ui/themes";

import { consumeChangelog } from "../changelogs/helpers";

import { sendCaseNotification, setCaseStatus } from "./actions";

export function Resolution({
  id,
  status,
  category,
  title,
  reporters,
}: {
  id: string;
  status: CaseDocument["status"];
  category: CaseDocument["category"];
  title: string;
  reporters: User[];
}) {
  const [notification, setNotification] = useState("");
  const [selectedReporters, setSelectedReporters] = useState(
    reporters.map((user) => user._id),
  );

  const queryClient = useQueryClient();
  const { isPending: isPendingStatusChange, mutate: mutateStatus } =
    useMutation({
      mutationFn: async (status: CaseDocument["status"]) => {
        await consumeChangelog(setCaseStatus(id, status));
        return status;
      },
      onSuccess(status) {
        queryClient.setQueryData([id], (data: { cs: CaseDocument }) => ({
          ...data,
          cs: {
            ...data.cs,
            status,
          },
        }));
      },
    });

  const { isPending: isPendingSend, mutate: sendNotification } = useMutation({
    mutationFn: async (content: string) => {
      if (selectedReporters.length === 0) return;
      if (content.trim().length === 0) return;

      await consumeChangelog(
        sendCaseNotification(id, selectedReporters, content),
      );
    },
  });

  useEffect(() => {
    setNotification(
      reportCategoryTemplateResolutionResponse(category as never),
    );
  }, [category]);

  return (
    <>
      <Heading size="2">Notify Reporters</Heading>
      <Text color="gray" size="1">
        This will send a notification to{" "}
        <Popover.Root>
          <Popover.Trigger>
            <Text className="underline">
              {selectedReporters.length} reporter(s)
            </Text>
          </Popover.Trigger>
          <Popover.Content style={{ width: 300 }}>
            <Flex direction="column" gap="2">
              {reporters.map((reporter) => (
                <label htmlFor={`reporter-${reporter._id}`}>
                  <Flex key={reporter._id} align="center" gap="2">
                    <Checkbox
                      size="3"
                      checked={selectedReporters.includes(reporter._id)}
                      onClick={() =>
                        setSelectedReporters((reporters) => [
                          ...reporters.filter((x) => x !== reporter._id),
                          ...(reporters.includes(reporter._id)
                            ? []
                            : [reporter._id]),
                        ])
                      }
                      id={`reporter-${reporter._id}`}
                    />
                    <Avatar
                      size="2"
                      fallback={reporter.username[0]}
                      src={
                        reporter.avatar
                          ? `https://autumn.revolt.chat/avatars/${reporter.avatar._id}`
                          : undefined
                      }
                      radius="full"
                    />
                    {reporter.username}#{reporter.discriminator}
                  </Flex>
                </label>
              ))}
            </Flex>
          </Popover.Content>
        </Popover.Root>
        .
      </Text>
      <Text size="2">
        <b>Case {id.substring(18, 26)}</b>: {title}
      </Text>
      <TextArea
        value={notification}
        onChange={(e) => setNotification(e.currentTarget.value)}
        rows={10}
      />
      <Button
        onClick={() => sendNotification(notification)}
        className="w-fit"
        disabled={isPendingSend}
      >
        Send Notification
      </Button>

      <Heading size="2">Change Status</Heading>
      {status === "Open" ? (
        <Button
          onClick={() => mutateStatus("Closed")}
          className="w-fit"
          disabled={isPendingStatusChange}
        >
          Close Case
        </Button>
      ) : (
        <Button
          onClick={() => mutateStatus("Open")}
          className="w-fit"
          disabled={isPendingStatusChange}
          variant="soft"
        >
          Open Case
        </Button>
      )}
    </>
  );
}
