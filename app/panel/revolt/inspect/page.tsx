import { PageTitle } from "@/components/common/navigation/PageTitle";
import { getScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { Metadata } from "next";

import { Search } from "./Search";

export const metadata: Metadata = {
  title: "Search and Inspect",
  description: "Find and inspect content on the platform.",
};

export default async function Inspector() {
  await getScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  return (
    <>
      <PageTitle metadata={metadata} />
      <Search />
    </>
  );
}
