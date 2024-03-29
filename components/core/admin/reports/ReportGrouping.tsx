"use client";

import { ReportDocument } from "@/lib/db/types";

import { Button, Card, Flex, Text } from "@radix-ui/themes";

import { Report } from "./Report";
import { createCase } from "./actions";

export function ReportGrouping({
  name,
  reports,
  allowCaseCreation,
  collapsible,
}: {
  name: string;
  reports: ReportDocument[];
  allowCaseCreation?: boolean;
  collapsible?: boolean;
}) {
  const title = (
    <Flex
      gap="2"
      justify="between"
      className={"!inline-flex" + (collapsible ? "" : " w-full")}
    >
      <Text as="div" size="2" weight="bold">
        {name}
      </Text>

      {allowCaseCreation && (
        <Button
          size="1"
          onClick={() =>
            createCase(
              name,
              reports.map((report) => report._id),
            )
          }
        >
          Handle
        </Button>
      )}
    </Flex>
  );

  const content = (
    <Flex gap="2" direction="column" className="mt-2">
      {reports.map((report) => (
        <Report
          key={report._id}
          report={report}
          allowCaseCreation={allowCaseCreation ? "ghost" : undefined}
        />
      ))}
    </Flex>
  );

  return (
    <Card>
      {collapsible ? (
        <details open>
          <summary>{title}</summary>
          {content}
        </details>
      ) : (
        <>
          {title}
          {content}
        </>
      )}
    </Card>
  );
}
