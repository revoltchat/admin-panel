import { PageTitle } from "@/components/common/navigation/PageTitle";
import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_HR_MEMBER_CREATE } from "@/lib/auth/rbacInternal";
import { Metadata } from "next";

import { NewTeamMemberForm } from "./NewTeamMember";

export const metadata: Metadata = {
  title: "Create Team Member",
  description: "Create a new team member.",
};

export default async function NewTeamMember() {
  await useScopedUser(RBAC_PERMISSION_HR_MEMBER_CREATE);

  return (
    <>
      <PageTitle metadata={metadata} />
      <NewTeamMemberForm />
    </>
  );
}
