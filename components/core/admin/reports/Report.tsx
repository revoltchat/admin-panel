"use client";

import { ReportDocument } from "@/lib/db/types";
import { WindowTrigger } from "@/lib/winbox/WindowTrigger";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { decodeTime } from "ulid";

import { Badge, Button, Card, Flex, Text } from "@radix-ui/themes";

import { createCase } from "./actions";

dayjs.extend(relativeTime);

export function Report({
  report,
  allowCaseCreation,
}: {
  report: ReportDocument;
  allowCaseCreation?: boolean | "ghost";
}) {
  const reportOpenedTime = dayjs(decodeTime(report._id));
  const urgentReport = report.content.report_reason.includes("Illegal");
  const overdueReport =
    dayjs().diff(reportOpenedTime, "d") > (urgentReport ? 1 : 7);

  const content = (
    <Card>
      <Flex gap="2" align="center">
        <Flex gap="2" grow="1" wrap="wrap">
          <Text as="div" size="2" weight="bold">
            {(report.additional_context || "No reason specified.")
              .trim()
              .replace(/\s+/g, " ")}
          </Text>

          <Text as="div" size="2" color="gray">
            <Badge
              color={overdueReport ? "red" : "gray"}
              suppressHydrationWarning
            >
              {reportOpenedTime.fromNow()}
            </Badge>{" "}
            &middot;{" "}
            <Text color={urgentReport ? "red" : "gray"}>
              {report.content.report_reason}
            </Text>{" "}
            &middot; {report.content.type}
          </Text>
        </Flex>

        {allowCaseCreation && (
          <Flex gap="4" align="center" shrink="0">
            <Button size="1" variant="ghost">
              <a
                href={`https://admin.revolt.chat/panel/reports/${report._id}`}
                target="_blank"
                className="h-fit"
              >
                Preview
              </a>
            </Button>
            <WindowTrigger
              title="Add to case"
              url={`/panel/moderation/cases/add/${report._id}?hideNav=1`}
            >
              <Button size="1" variant="ghost">
                Add to case
              </Button>
            </WindowTrigger>
            <Button
              size="1"
              variant={allowCaseCreation === "ghost" ? "ghost" : undefined}
              onClick={() =>
                createCase(
                  `${report.content.type}: ${(
                    report.additional_context || "No reason specified"
                  )
                    .trim()
                    .replace(/\s+/g, " ")}`,
                  [report._id],
                )
              }
            >
              Handle
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  );

  if (allowCaseCreation) return content;

  return (
    <a
      href={`https://admin.revolt.chat/panel/reports/${report._id}`}
      target="_blank"
    >
      {content}
    </a>
  );
}
