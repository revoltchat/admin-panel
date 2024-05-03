import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { checkPermission, flattenPermissionsFor } from "./rbacEngine";

/**
 * Check whether the currently authorised user has a given scope and return them if such
 * @param scope Required scope
 * @returns User email
 */
export async function useScopedUser(scope: string) {
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
