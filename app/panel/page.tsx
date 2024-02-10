import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

import { Text } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View pending alerts and important metrics from one place.",
};

export default function Dashboard() {
  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>many such cases...</Text>
    </>
  );
}
