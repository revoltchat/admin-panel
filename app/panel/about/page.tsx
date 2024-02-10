import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

import { Text } from "@radix-ui/themes";

import pkg from "../../../package.json";

export const metadata: Metadata = {
  title: "About",
  description:
    "Version information and other useful tidbits about this software.",
};

export default async function About() {
  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>
        Version {pkg.version} &middot;{" "}
        <a href="https://git.is.horse/revolt/research-development/swiss-army-knife">
          Source code
        </a>
      </Text>
    </>
  );
}
