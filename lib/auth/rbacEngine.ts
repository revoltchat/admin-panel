import { fetchPerson } from "../database";
import { fetchPositions } from "../database/hr/position";
import { fetchRoles } from "../database/hr/role";

export async function flattenPermissionsFor(
  query: { _id: string } | { email: string },
) {
  const person = await fetchPerson(query);
  if (!person) throw "Person doesn't exist!";
  if (person.status !== "Active") return [];

  const positions = await fetchPositions(person.positions);
  const roles = await fetchRoles([
    ...positions.flatMap((position) => position.roles),
    ...person.roles,
  ]);

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
