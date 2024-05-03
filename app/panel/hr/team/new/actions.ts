"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_HR_MEMBER_CREATE } from "@/lib/auth/rbacInternal";
import { createPerson, fetchPerson } from "@/lib/database";

export async function createTeamMember(
  name: string,
  email: string,
  reason: string,
) {
  const userEmail = await useScopedUser(RBAC_PERMISSION_HR_MEMBER_CREATE);

  email = email.toLowerCase();
  const existingIdent = await fetchPerson({
    email,
  });

  if (existingIdent) throw new Error("Identifier already in use!");

  await createPerson(name, email, reason, userEmail);
}
