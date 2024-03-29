import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Report } from "@/components/core/admin/reports/Report";
import { cases, reports } from "@/lib/db/types";
import { notFound } from "next/navigation";

import { Flex } from "@radix-ui/themes";

import { AddReportContent } from "./Content";

type Props = { params: { reportId: string } };

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function AddReport({ params }: Props) {
  const report = await reports().findOne({ _id: params.reportId });
  if (!report || report.case_id) return notFound();

  const openCases = await cases()
    .find({
      status: "Open",
    })
    .toArray();

  return (
    <Flex direction="column" gap="2">
      <PageTitle metadata={{ title: "Assign Report to Case" }} />
      <Report report={report} />

      <AddReportContent id={report._id} openCases={openCases} />
    </Flex>
  );
}
