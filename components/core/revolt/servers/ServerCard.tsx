"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Server, User } from "revolt-api";
import { decodeTime } from "ulid";

import { Avatar, Badge, Card, Flex, Text } from "@radix-ui/themes";

dayjs.extend(relativeTime);

export function ServerCard({
  server,
  owner,
}: {
  server: Server;
  owner?: User;
}) {
  return (
    <Card>
      <Flex gap="2" direction="column">
        <Flex gap="2" align="center">
          <Avatar
            src={
              server.icon
                ? `https://autumn.revolt.chat/icons/${server.icon._id}`
                : undefined
            }
            fallback={server.name[0]}
          />
          <Text>{server.name}</Text>
        </Flex>
        <Flex gap="2" wrap="wrap">
          <Badge color="purple">Server</Badge>
          <Badge color="gray">
            Created {dayjs(decodeTime(server._id)).fromNow()}
          </Badge>
          {owner && (
            <Badge color="gray">
              Owned by{" "}
              <Avatar
                className="max-w-3 max-h-3"
                fallback={owner.username[0]}
                src={
                  owner.avatar
                    ? `https://autumn.revolt.chat/avatars/${owner.avatar._id}`
                    : undefined
                }
                radius="full"
              />{" "}
              {owner.username}#{owner.discriminator}
            </Badge>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
