import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

import { Text } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Team Members",
  description: "View and manage the Revolt team member directory.",
};

export default async function Home() {
  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>hlelo!</Text>
    </>
  );
}
