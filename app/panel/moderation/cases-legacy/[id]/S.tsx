"use client";

import { Avatar, Checkbox, Flex, Select } from "@radix-ui/themes";

export async function S() {
  return (
    <>
      <Select.Root>
        <Select.Trigger placeholder="Select an action to create..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Users</Select.Label>
            <Select.Item value="user.strike">Strike Users</Select.Item>
            <Select.Item value="user.suspend">Suspend Users</Select.Item>
            <Select.Item value="user.ban">Ban Users</Select.Item>
            <Select.Item value="user.delete">
              Schedule Deletion for Accounts
            </Select.Item>
            <Select.Item value="user.notice">Send Notices</Select.Item>
            <Select.Item value="user.reset">Reset Profiles</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Messages</Select.Label>
            <Select.Item value="messages.delete">Delete Messages</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Servers</Select.Label>
            <Select.Item value="server.remove">Remove Servers</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Flex direction="column" gap="2">
        <label htmlFor="a">
          <Flex gap="2" align="center">
            <Checkbox size="3" id="a" />
            <Avatar fallback={"a"} radius="full" size="1" /> Username#1234
          </Flex>
        </label>
        <label htmlFor="b">
          <Flex gap="2" align="center">
            <Checkbox size="3" id="b" />
            <Avatar fallback={"b"} radius="full" size="1" /> Username#1234
          </Flex>
        </label>
        <label htmlFor="c">
          <Flex gap="2" align="center">
            <Checkbox size="3" id="c" />
            <Avatar fallback={"c"} radius="full" size="1" /> Username#1234
          </Flex>
        </label>
      </Flex>
    </>
  );
}
