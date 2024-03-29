import { PageTitle } from "@/components/common/navigation/PageTitle";
import { useScopedUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Fetch information by known IDs.",
};

export default async function Inspect() {
  await useScopedUser("*");
  return <PageTitle metadata={metadata} />;
}
