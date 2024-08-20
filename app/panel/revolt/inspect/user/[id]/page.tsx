import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Changelog } from "@/components/core/admin/changelogs/Changelog";
import { getScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import {
  fetchAccountById,
  fetchUserById,
  revoltUserInfo,
} from "@/lib/database/revolt";
import { fetchStrikes } from "@/lib/database/revolt/safety_strikes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Skeleton,
  Text,
} from "@radix-ui/themes";

import { UserCard } from "./UserCard";
import {
  ManageAccount,
  ManageAccountEmail,
  ManageAccountMFA,
} from "./accountManagement";
import { UserStrikes } from "./userManagement";

type Props = { params: { id: string } };

const getUser = cache(async (id: string) => ({
  account: await fetchAccountById(id),
  user: await fetchUserById(id),
}));

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const { account, user } = await getUser(params.id);
  if (!account && !user)
    return {
      title: "Not Found",
    };

  return {
    title:
      (user ? `${user.username}#${user.discriminator}` : account!.email) +
      " - Inspect User",
  };
}

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function User({ params }: Props) {
  await getScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  const { account, user } = await getUser(params.id);
  if (!account && !user) notFound();

  const strikes = await fetchStrikes(params.id);

  //   const { messages: recentMessages, authors: recentMessageAuthors } =
  //     await fetchMessages({
  //       author: params.id,
  //     });

  return (
    <>
      <PageTitle
        metadata={{
          title:
            (user ? `${user.username}#${user.discriminator}` : account!.email) +
            " - Inspect User",
        }}
      />

      <Grid columns={{ initial: "1", lg: "2", xl: "3" }} gap="2" width="auto">
        {user && (
          <UserCard
            user={revoltUserInfo(user)}
            showProfile
            showActions="short"
          />
        )}
        {account && (
          <Card>
            <Flex direction="column" gap="3">
              <Flex direction="column">
                <Heading size="6">Account Management</Heading>
                <Text color="gray" size="1">
                  Information about this user account and administrative
                  options.
                </Text>
              </Flex>

              <ManageAccount
                id={params.id}
                attempts={account.lockout?.attempts || 0}
              />

              <Flex direction="column" gap="2">
                <Heading size="2">Email</Heading>
                <ManageAccountEmail
                  id={params.id}
                  email={account.email}
                  verified={account.verification.status !== "Pending"}
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Heading size="2">Multi-Factor Authentication</Heading>
                <ManageAccountMFA
                  id={params.id}
                  totp={account.mfa?.totp_token?.status === "Enabled"}
                  recovery={account.mfa?.recovery_codes?.length || 0}
                />
              </Flex>

              {false && (
                <Flex direction="column" gap="2">
                  <Heading size="2">Authifier Data</Heading>
                  <pre className="text-wrap">
                    <code></code>
                  </pre>
                </Flex>
              )}
            </Flex>
          </Card>
        )}

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Strikes</Heading>
              <Text color="gray" size="1">
                Information about past infractions regarding this user.
              </Text>
            </Flex>
            <UserStrikes
              id={params.id}
              flags={user?.flags || 0}
              strikes={strikes}
            />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Moderation History</Heading>
              <Text color="gray" size="1">
                Cases this user has been involved in.
              </Text>
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Alerts</Heading>
              <Text color="gray" size="1">
                Moderation notices sent to the user.
              </Text>
            </Flex>
            <Flex gap="2">
              <Button variant="outline">Send Alert</Button>
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Bots</Heading>
              <Text color="gray" size="1">
                Bots owned by this user.
              </Text>
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Friends</Heading>
              <Text color="gray" size="1">
                Users who are friends with this user.
              </Text>
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Servers</Heading>
              <Text color="gray" size="1">
                Servers this user is in.
              </Text>
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Flex direction="column">
              <Heading size="6">Reports</Heading>
              <Text color="gray" size="1">
                Reports this user has created.
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      <Card>
        <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Discuss</Heading>
            <Text color="gray" size="1">
              Recent actions and comments relating to this user.
            </Text>
          </Flex>

          <Changelog object={{ type: "User", id: params.id }} />
        </Flex>
      </Card>
    </>
  );
}
