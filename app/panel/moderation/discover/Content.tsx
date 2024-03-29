import { NoEntries } from "@/components/common/data/NoEntries";
import {
  DiscoverRequestDocument,
  adminDiscoverRequests,
  botAnalytics,
  bots,
  serverAnalytics,
  servers,
  users,
} from "@/lib/db/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { Bot, Server, User } from "revolt-api";
import { decodeTime } from "ulid";

import { Avatar, Badge, Card, Flex, Text } from "@radix-ui/themes";

dayjs.extend(relativeTime);

/**
 * Statistics about Discover listings
 */
export async function DiscoverStats() {
  const discoverableServers = await servers().countDocuments({
    discoverable: true,
  });

  const discoverableBots = await bots().countDocuments({
    discoverable: true,
  });

  const displayedServers = await serverAnalytics().countDocuments({
    volume: {
      $gte: 5,
    },
    discoverable: true,
  });

  const displayedBots = await botAnalytics().countDocuments({
    usage: {
      $gte: 1,
    },
    discoverable: true,
  });

  const nextGen = new Date();
  nextGen.setHours(Math.floor(nextGen.getHours() / 6 + 1) * 6);

  return (
    <>
      <Text>
        There are <Badge color="gray">{discoverableServers} servers</Badge> and{" "}
        <Badge color="gray">{discoverableBots} bots</Badge> currently eligible
        to be displayed.
      </Text>
      <Text>
        Of which, <Badge>{displayedServers} servers</Badge> and{" "}
        <Badge>{displayedBots} bots</Badge> are currently listed.
      </Text>
      <Text>
        Rankings will regenerate{" "}
        <Badge color="mint">{dayjs(nextGen).fromNow()}</Badge>.
      </Text>
    </>
  );
}

/**
 * See requests to add to Discover
 */
export async function DiscoverRequests({
  requests,
}: {
  requests: DiscoverRequestDocument[];
}) {
  // Fetch all servers for requests
  let requestedServers = await servers()
    .find({
      _id: {
        $in: requests
          .filter((r) => r.type === "Server")
          .map((r) => (r as { serverId: string }).serverId),
      },
    })
    .toArray()
    .then((arr) =>
      arr.reduce(
        (d, v) => ({ ...d, [v._id]: v }),
        {} as Record<string, Server>,
      ),
    );

  // Fetch all bots for requests
  let requestedBots = await bots()
    .find({
      _id: {
        $in: requests
          .filter((r) => r.type === "Bot")
          .map((r) => (r as { botId: string }).botId),
      },
    })
    .toArray()
    .then((arr) =>
      arr.reduce((d, v) => ({ ...d, [v._id]: v }), {} as Record<string, Bot>),
    );

  // Fetch corresponding users for bots
  // We do it in this order because bots can be deleted but not users
  let requestedBotUsers = await users()
    .find({
      _id: {
        $in: Object.keys(requestedBots),
      },
    })
    .toArray()
    .then((arr) =>
      arr.reduce((d, v) => ({ ...d, [v._id]: v }), {} as Record<string, User>),
    );

  // Remove invalid entries
  const invalidEntries = requests.filter((entry) =>
    entry.type === "Server"
      ? !requestedServers[entry.serverId]
      : !requestedBots[entry.botId],
  );

  if (invalidEntries.length) {
    requests = requests.filter((entry) =>
      entry.type === "Server"
        ? requestedServers[entry.serverId]
        : requestedBots[entry.botId],
    );

    await adminDiscoverRequests().deleteMany({
      _id: {
        $in: invalidEntries.map(({ _id }) => _id),
      },
    });
  }

  return (
    <>
      {requests.length === 0 && <NoEntries />}
      {requests.map((request) => {
        if (request.type === "Server") {
          const server = requestedServers[request.serverId];

          return (
            <Card asChild key={request._id}>
              <Link href={`/panel/discover/request/${request._id}`}>
                <Flex gap="2" align="center">
                  <Avatar
                    src={
                      server.icon
                        ? `https://autumn.revolt.chat/icons/${server.icon._id}`
                        : undefined
                    }
                    fallback={server.name[0]}
                  />
                  <Flex direction="column">
                    <Flex gap="2" align="center">
                      <Text>{server.name}</Text>
                      <Badge color="gray">Server</Badge>
                    </Flex>
                    <Text color="gray" size="1">
                      Requested {dayjs(decodeTime(request._id)).fromNow()}
                    </Text>
                  </Flex>
                </Flex>
              </Link>
            </Card>
          );
        } else {
          const user = requestedBotUsers[request.botId];

          return (
            <Card asChild key={request._id}>
              <Link href={`/panel/discover/request/${request._id}`}>
                <Flex gap="2" align="center">
                  <Avatar
                    src={
                      user.avatar
                        ? `https://autumn.revolt.chat/avatars/${user.avatar._id}`
                        : undefined
                    }
                    fallback={user.username[0]}
                  />
                  <Flex direction="column">
                    <Flex gap="2" align="center">
                      <Text>
                        {user.username}#{user.discriminator}
                      </Text>
                      <Badge color="gray">Bot</Badge>
                    </Flex>
                    <Text color="gray" size="1">
                      Requested {dayjs(decodeTime(request._id)).fromNow()}
                    </Text>
                  </Flex>
                </Flex>
              </Link>
            </Card>
          );
        }
      })}
    </>
  );
}
