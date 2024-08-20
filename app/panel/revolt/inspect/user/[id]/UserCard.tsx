"use client";

import type { RevoltUserInfo } from "@/lib/database/revolt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Markdown from "react-markdown";
import { decodeTime } from "ulid";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";

import { UserStrikeActions } from "./userManagement";

dayjs.extend(relativeTime);

export function UserCard({
  user,
  showProfile,
  showActions,
}: {
  user: RevoltUserInfo;
  showProfile?: boolean;
  showActions?: "none" | "short" | "all";
}) {
  return (
    <Card>
      <Flex gap="3" direction="column">
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            src={
              user.avatar
                ? `https://autumn.revolt.chat/avatars/${user.avatar?._id}`
                : `https://api.revolt.chat/users/${user._id}/default_avatar`
            }
            fallback={user.username.substring(0, 1)}
          />

          <Box>
            <Text as="div" size="2" weight="bold">
              {user.username}#{user.discriminator}{" "}
              <Text weight="regular">{user.username}</Text>
            </Text>
            <Flex gap="2">
              {user.status?.text && (
                <Badge color="gray">{user.status.text}</Badge>
              )}
              <Badge
                suppressHydrationWarning
                title={new Date(decodeTime(user._id)).toISOString()}
              >
                Created {dayjs(decodeTime(user._id)).fromNow()}
              </Badge>
              {user.bot && <Badge color="gold">Bot</Badge>}
              {user.relations.friends > 0 && (
                <Badge>{user.relations.friends} friends</Badge>
              )}
            </Flex>
          </Box>
        </Flex>

        {(showActions === "short" || showActions === "all") && (
          <Flex gap="2">
            {showActions === "all" && (
              <UserStrikeActions id={user._id} flags={user.flags || 0} />
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  Clear Profile
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Avatar</DropdownMenu.Item>
                <DropdownMenu.Item>Profile Banner</DropdownMenu.Item>
                <DropdownMenu.Item>Display Name</DropdownMenu.Item>
                <DropdownMenu.Item>Bio</DropdownMenu.Item>
                <DropdownMenu.Item>Status</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>All</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  Data Export
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Law Enforcement</DropdownMenu.Item>
                <DropdownMenu.Item>GDPR Data Package</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        )}

        {showProfile && (
          <Flex direction="column" gap="2">
            <Heading size="2">Profile Bio</Heading>
            <Card>
              <Markdown>{user.profile?.content ?? "No profile bio."}</Markdown>
            </Card>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
