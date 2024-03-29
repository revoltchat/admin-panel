import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Changelog } from "@/components/core/admin/changelogs/Changelog";
import { ServerCard } from "@/components/core/revolt/servers/ServerCard";
import { ServerInterface } from "@/components/core/revolt/servers/ServerInterface";
import { adminDiscoverRequests, servers } from "@/lib/db/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Flex, Heading, Text } from "@radix-ui/themes";

import { RequestActions } from "./Actions";

export const metadata: Metadata = {
  title: "Discover Request",
};

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function Request({ params }: { params: { id: string } }) {
  const request = await adminDiscoverRequests().findOne({ _id: params.id });
  if (!request) return notFound();

  const server =
    request.type === "Server"
      ? await servers().findOne({ _id: request.serverId })
      : null;

  return (
    <>
      <PageTitle metadata={metadata} />
      <Flex direction="column" gap="6">
        {request.type === "Server" ? (
          <>
            <Flex direction="column" gap="2">
              <ServerCard server={server!} />
              <ServerInterface server={server!} />
            </Flex>
          </>
        ) : (
          <></>
        )}

        <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Activity</Heading>
            <Text color="gray" size="1">
              Recent changes to this {request.type.toLowerCase()}.
            </Text>
          </Flex>

          <Changelog
            object={
              request.type === "Server"
                ? { type: "Server", id: request.serverId }
                : { type: "Bot", id: request.botId }
            }
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Heading size="6">Decide</Heading>
          <RequestActions request={request} />
        </Flex>
      </Flex>
    </>
  );
}
