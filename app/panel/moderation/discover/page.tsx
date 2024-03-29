import { PageTitle } from "@/components/common/navigation/PageTitle";
import { adminDiscoverRequests } from "@/lib/db/types";
import { Metadata } from "next";

import { DiscoverRequests, DiscoverStats } from "./Content";
import { DiscoverTabs } from "./Tabs";

export const metadata: Metadata = {
  title: "Discover Listings",
  description: "Servers & bots listed on Discover.",
};

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function Discover() {
  const requests = await adminDiscoverRequests().find().toArray();

  return (
    <>
      <PageTitle metadata={metadata} />
      <DiscoverTabs
        stats={<DiscoverStats />}
        requests={<DiscoverRequests requests={requests} />}
        requestCount={requests.length}
      />
    </>
  );
}
