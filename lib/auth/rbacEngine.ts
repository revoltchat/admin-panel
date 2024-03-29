import { db } from "../db";

// TODO organise db types
type Person = {
  _id: string;
  name: string;
  email: string;
  status: "Unapproved" | "Inactive" | "Active";
  positions: string[];
  roles: string[];
};

type Position = {
  _id: string;
  title: string;
  roles: string[];
};

type Role = {
  _id: string;
  permissions: string[];
};

export async function flattenPermissionsFor(
  query: { _id: string } | { email: string },
) {
  const person = await db("revolt_hr")
    .collection<Person>("people")
    .findOne(query);
  if (!person) throw "Person doesn't exist!";

  const positions = await db("revolt_hr")
    .collection<Position>("positions")
    .find({
      _id: {
        $in: person.positions,
      },
    })
    .toArray();

  const roles = await db("revolt_hr")
    .collection<Role>("roles")
    .find({
      _id: {
        $in: [
          ...positions.flatMap((position) => position.roles),
          ...person.roles,
        ],
      },
    })
    .toArray();

  return roles.flatMap((role) => role.permissions);
}

export function checkPermission(permissions: string[], permission: string) {
  if (permissions.includes("*")) return true;

  const segments = permission.split(".");
  while (segments.length) {
    if (permissions.includes(segments.join("."))) {
      return true;
    }

    segments.pop();
  }

  return false;
}
