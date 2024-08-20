"use client";

import { Strike } from "@/lib/database/revolt/safety_strikes";
import dayjs from "dayjs";
import relativeTime from "dayjs";
import { decodeTime } from "ulid";

import { Badge, Button, Flex, Table } from "@radix-ui/themes";

dayjs.extend(relativeTime);

export function UserStrikeActions({
  id,
  flags,
}: {
  id: string;
  flags: number;
}) {
  return (
    <>
      <Button>Strike</Button>
      <Button color="amber">Suspend</Button>
      <Button color="red">Ban</Button>
    </>
  );
}

export function UserStrikes({
  id,
  flags,
  strikes,
}: {
  id: string;
  flags: number;
  strikes: Strike[];
}) {
  return (
    <>
      <Flex gap="2">
        <UserStrikeActions id={id} flags={flags} />
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Information</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {strikes.map((strike) => (
            <Table.Row>
              <Table.Cell>{strike.reason}</Table.Cell>
              <Table.Cell>
                {strike.type === "suspension" && (
                  <Badge color="amber">Suspended</Badge>
                )}{" "}
                {strike.type === "ban" && <Badge color="red">Banned</Badge>}{" "}
                <Badge
                  suppressHydrationWarning
                  title={new Date(decodeTime(strike._id)).toISOString()}
                >
                  Created {dayjs(decodeTime(strike._id)).fromNow()}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
