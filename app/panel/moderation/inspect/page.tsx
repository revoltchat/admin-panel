import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Fetch information by known IDs.",
};

export default function Inspect() {
  return <PageTitle metadata={metadata} />;
}
