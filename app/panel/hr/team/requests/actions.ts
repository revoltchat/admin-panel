"use server";

import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_HR_MEMBER_APPROVE } from "@/lib/auth/rbacInternal";
import { deletePersonRequest, updatePersonApproved } from "@/lib/database";

export async function approveTeamMember(_id: string, approve: boolean) {
  await useScopedUser(RBAC_PERMISSION_HR_MEMBER_APPROVE);
  if (approve) {
    await updatePersonApproved(_id);
  } else {
    await deletePersonRequest(_id);
  }
}
