"use client";

import { SnapshotDocument } from "@/lib/db/types";
import { WindowTrigger } from "@/lib/winbox/WindowTrigger";
import { Channel, User } from "revolt-api";

import { Avatar, Card, Flex, Text } from "@radix-ui/themes";

import { Message } from "../../revolt/messages/Message";
import { ServerCard } from "../../revolt/servers/ServerCard";

import { AuxiliaryEvidenceForUser } from "./AuxiliaryEvidence";

export function EvidencePreview({
  snapshot,
  messageAuthors,
  messageChannels,
}: {
  snapshot: SnapshotDocument;
  messageAuthors: Record<string, User>;
  messageChannels: Record<string, Channel>;
}) {
  switch (snapshot.content._type) {
    case "Message":
      return (
        <>
          <WindowTrigger
            title={`Message "${snapshot.content.content?.substring(0, 32) ?? "No Text"}${snapshot.content.content?.length ?? 0 > 32 ? "..." : ""}"`}
            url={`/panel/inspect/snapshot/${snapshot._id}?hideNav=1`}
          >
            <Card>
              <Message
                message={snapshot.content}
                author={messageAuthors[snapshot.content.author]}
                channel={messageChannels[snapshot.content.channel]}
              />
            </Card>
          </WindowTrigger>
          <WindowTrigger
            title={`Author of ${snapshot.content._id}`}
            url={`/panel/inspect/user/${snapshot.content.author}?hideNav=1`}
          >
            author
          </WindowTrigger>
        </>
      );
    case "Server":
      return (
        <>
          <WindowTrigger
            title={`Server: ${snapshot.content.name}`}
            url={`/panel/inspect/snapshot/${snapshot._id}?hideNav=1`}
          >
            <ServerCard server={snapshot.content} />
          </WindowTrigger>
          <WindowTrigger
            title={`Server: ${snapshot.content.name}`}
            url={`/panel/inspect/server/${snapshot.content._id}?hideNav=1`}
          >
            view
          </WindowTrigger>
        </>
      );
    case "User":
      return (
        <>
          <WindowTrigger
            title={`User: ${snapshot.content.username}#${snapshot.content.discriminator}`}
            url={`/panel/inspect/snapshot/${snapshot._id}?hideNav=1`}
          >
            <Card>
              <Flex gap="4" align="center">
                <Avatar
                  fallback={snapshot.content.username[0]}
                  src={
                    snapshot.content.avatar
                      ? `https://autumn.revolt.chat/avatars/${snapshot.content.avatar?._id}`
                      : undefined
                  }
                  radius="full"
                />
                <Flex direction="column" className="min-w-0">
                  <Text>
                    {snapshot.content.username}#{snapshot.content.discriminator}{" "}
                    {snapshot.content.bot && "(bot)"}
                  </Text>
                  {/*<AuxiliaryEvidenceForUser user={snapshot.content} />*/}
                </Flex>
              </Flex>
            </Card>
          </WindowTrigger>
          <WindowTrigger
            title={`User: ${snapshot.content.username}#${snapshot.content.discriminator}`}
            url={`/panel/inspect/user/${snapshot.content._id}?hideNav=1`}
          >
            view
          </WindowTrigger>
        </>
      );
    default:
      return null;
  }
}
