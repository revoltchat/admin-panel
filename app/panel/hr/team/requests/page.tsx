import { PageTitle } from "@/components/common/navigation/PageTitle";
import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_HR_MEMBER_APPROVE } from "@/lib/auth/rbacInternal";
import { fetchPeoplePendingApproval } from "@/lib/database";
import { Metadata } from "next";

import { ApproveTeamMember } from "./ApproveTeamMember";

// import { NewTeamMemberForm } from "./NewTeamMember";

export const metadata: Metadata = {
  title: "View Approval Requests",
  description: "Approve new team members.",
};

export default async function NewTeamMember() {
  await useScopedUser(RBAC_PERMISSION_HR_MEMBER_APPROVE);
  const requests = await fetchPeoplePendingApproval();

  return (
    <>
      <PageTitle metadata={metadata} />
      <div className="flex flex-col gap-8">
        {requests.map((request) => (
          <ApproveTeamMember person={request} />
        ))}
      </div>
    </>
  );
}
