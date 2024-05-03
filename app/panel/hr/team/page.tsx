import { PageTitle } from "@/components/common/navigation/PageTitle";
import { useUserWithScopes } from "@/lib/auth";
import {
  RBAC_PERMISSION_HR_MEMBER_APPROVE,
  RBAC_PERMISSION_HR_MEMBER_CREATE,
} from "@/lib/auth/rbacInternal";
import { Hr, fetchPeople } from "@/lib/database";
import { fetchPositions } from "@/lib/database/hr/position";
import { fetchRoles } from "@/lib/database/hr/role";
import { Metadata } from "next";
import Link from "next/link";

import { Badge, Button, Table } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Team Members",
  description: "View and manage the Revolt team member directory.",
};

export default async function Home() {
  const [_, scopes] = await useUserWithScopes([
    RBAC_PERMISSION_HR_MEMBER_CREATE,
    RBAC_PERMISSION_HR_MEMBER_APPROVE,
  ]);

  const people = await fetchPeople();

  const positions = await fetchPositions(
    people.flatMap((person) => person.positions),
  );

  const roles = await fetchRoles([
    ...people.flatMap((person) => person.roles),
    ...positions.flatMap((position) => position.roles),
  ]);

  const positionsDict = positions.reduce(
    (d, p) => ({ ...d, [p._id]: p }),
    {} as Record<string, Hr["Position"]>,
  );

  const rolesDict = roles.reduce(
    (d, p) => ({ ...d, [p._id]: p }),
    {} as Record<string, Hr["Role"]>,
  );

  const approvalRequests = people.filter(
    (person) => person.status === "Pending",
  ).length;

  function Person({ person }: { person: Hr["Person"] }) {
    return (
      <Table.Row>
        <Table.RowHeaderCell>
          {person.name}{" "}
          {person.status === "Inactive" && <Badge color="red">Inactive</Badge>}
        </Table.RowHeaderCell>
        <Table.Cell>
          {person.email}{" "}
          {person.email.endsWith("@revolt.chat") ? null : (
            <Badge color="amber">External</Badge>
          )}
        </Table.Cell>
        <Table.Cell>
          <div className="flex gap-2">
            {person.positions
              .map((position) => positionsDict[position])
              .map((position) => (
                <Badge color={position.color}>{position.title}</Badge>
              ))}
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className="flex gap-2">
            {[
              ...person.positions.flatMap(
                (position) => positionsDict[position].roles,
              ),
              ...person.roles,
            ]
              .map((role) => rolesDict[role])
              .map((role) => (
                <Badge color={role.color}>{role.name}</Badge>
              ))}
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <>
      <PageTitle metadata={metadata} />

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Identifier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Positions</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Roles</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {people
            .filter(
              (person) =>
                person.status === "Active" || person.status === "Inactive",
            )
            .map((person) => (
              <Person person={person} />
            ))}
        </Table.Body>
      </Table.Root>

      <div className="flex gap-2">
        {scopes["hr.people.create"] && (
          <Button variant="outline">
            <Link href="/panel/hr/team/new">Request New Member</Link>
          </Button>
        )}
        {scopes["hr.people.approve"] && (approvalRequests ? true : null) && (
          <Button variant="outline" asChild>
            <Link href="/panel/hr/team/requests">
              View Approval Requests ({approvalRequests})
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
