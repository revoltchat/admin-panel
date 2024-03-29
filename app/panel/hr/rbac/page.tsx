import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

import { Text } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Roles & Permissions",
  description: "Configure roles and assign permissions to them.",
};

export default async function Home() {
  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>hlelo!</Text>
    </>
  );
}
