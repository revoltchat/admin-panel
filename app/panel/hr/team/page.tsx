import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Hr, fetchPeople } from "@/lib/database";
import { fetchPositions } from "@/lib/database/hr/position";
import { fetchRoles } from "@/lib/database/hr/role";
import { Metadata } from "next";

import { Badge, Table } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Team Members",
  description: "View and manage the Revolt team member directory.",
};

export default async function Home() {
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

  function Person({ person }: { person: Hr["Person"] }) {
    return (
      <Table.Row>
        <Table.RowHeaderCell>
          {person.name}{" "}
          {person.status === "Inactive" && <Badge color="red">Inactive</Badge>}
        </Table.RowHeaderCell>
        <Table.Cell>{person.email}</Table.Cell>
        <Table.Cell>
          {person.positions
            .map((position) => positionsDict[position])
            .map((position) => (
              <Badge color={position.color}>{position.title}</Badge>
            ))}
        </Table.Cell>
        <Table.Cell>
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
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Positions</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Roles</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {people.map((person) => (
            <Person person={person} />
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
