"use client";

import { useState } from "react";

import { Badge, Button, Flex, Table, TextField } from "@radix-ui/themes";

export function ManageAccount({
  id,
  attempts,
}: {
  id: string;
  attempts: number;
}) {
  return (
    // TODO
    <Flex direction="row" gap="2">
      <Button disabled>Disable Account</Button>
      <Button disabled>Queue Deletion</Button>
      <Button disabled={true || attempts === 0}>
        Reset Lockout {attempts > 0 && <>({attempts} failed attempts)</>}
      </Button>
    </Flex>
  );
}

export function ManageAccountEmail({
  id,
  email,
  verified,
}: {
  id: string;
  email: string;
  verified: boolean;
}) {
  const [value, setValue] = useState(email);

  return (
    <Flex direction="row" gap="2">
      <TextField.Root
        value={value}
        className="grow"
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Button disabled>Update</Button>
      <Button disabled>{verified ? "Email verified" : "Verify"}</Button>
    </Flex>
  );
}

export function ManageAccountMFA({
  id,
  totp,
  recovery,
}: {
  id: string;
  totp: boolean;
  recovery: number;
}) {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Method</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell>TOTP</Table.RowHeaderCell>
          <Table.Cell>
            <Badge color={totp ? "green" : "red"}>
              {totp ? "Enabled" : "Disabled"}
            </Badge>
          </Table.Cell>
          <Table.Cell>
            <Button size="1" disabled={!totp}>
              Disable
            </Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Recovery Codes</Table.RowHeaderCell>
          <Table.Cell>
            <Badge color={recovery ? "blue" : "red"}>
              {recovery} codes available
            </Badge>
          </Table.Cell>
          <Table.Cell>
            <Button size="1" disabled={recovery == 0}>
              Clear
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
