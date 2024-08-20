import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { checkPermission, flattenPermissionsFor } from "./rbacEngine";

/**
 * Check whether the currently authorised user has a given scope and return them if such
 * @param scope Required scope
 * @returns User email
 */
export async function getScopedUser(scope: string) {
  const session = await getServerSession();
  if (!session?.user?.email) return redirect("/panel/access-denied");

  const permissions = await flattenPermissionsFor({
    email: session.user.email,
  });

  if (!checkPermission(permissions, scope)) {
    console.debug(`${session.user.email} rejected, lacking ${scope}`);
    return redirect("/panel/access-denied?missing=" + scope);
  }

  return session.user.email;
}

/**
 * Check which of the given scopes are allowed to the given user
 * @param scopes Scopes to check
 * @returns User email and scope information
 */
export async function getUserWithScopes<T extends string>(
  scopes: T[],
): Promise<[string, Record<T, boolean>]> {
  const session = await getServerSession();
  if (!session?.user?.email) return redirect("/panel/access-denied");

  const permissions = await flattenPermissionsFor({
    email: session.user.email,
  });

  return [
    session.user.email,
    scopes.reduce(
      (r, s) => ({ ...r, [s]: checkPermission(permissions, s) }),
      {} as Record<T, boolean>,
    ),
  ];
}
