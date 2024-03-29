import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

import { Text } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Positions",
  description: "View and manage positions.",
};

export default async function Home() {
  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>hlelo!</Text>
    </>
  );
}
