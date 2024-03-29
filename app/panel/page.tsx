import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

import { Text } from "@radix-ui/themes";

import pkg from "../../package.json";

export const metadata: Metadata = {
  title: "Revolt Dashboard",
  description: "Integrated RBAC and content moderation tool for Revolt.",
};

export default async function Home() {
  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>TODO: something nice here</Text>
      <Text>
        Version {pkg.version} &middot;{" "}
        <a href="https://git.is.horse/revolt/research-development/swiss-army-knife">
          Source code
        </a>
      </Text>
    </>
  );
}
