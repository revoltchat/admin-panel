import { PageTitle } from "@/components/common/navigation/PageTitle";
import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import { adminDiscoverRequests, cases, reports } from "@/lib/db/types";
import { ticketMetrics } from "@/lib/integrations/zammad";
import dayjs from "dayjs";
import { Metadata } from "next";
import { decodeTime } from "ulid";

import { Badge, Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Revolt Admin Panel",
  description: "View pending alerts and important metrics from one place.",
};

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  const openReports = await reports().find({ status: "Created" }).toArray();
  const reportUrgency = openReports.map((report) =>
    report.content.report_reason.includes("Illegal"),
  );
  const overdueReports = openReports.filter(
    (report, i) =>
      dayjs().diff(decodeTime(report._id), "d") > (reportUrgency[i] ? 1 : 7),
  );
  const overdueAndUrgent = overdueReports.filter((_, i) => reportUrgency[i]);

  const openCases = await cases().find({ status: "Open" }).toArray();
  const staleCases = openCases.filter(
    (report) => dayjs().diff(decodeTime(report._id), "d") > 3,
  );

  const openDiscoverRequests = await adminDiscoverRequests().find().toArray();
  const staleDiscoverRequests = openDiscoverRequests.filter(
    (request) => dayjs().diff(decodeTime(request._id), "d") > 1,
  );

  const zammadTicketMetrics = await ticketMetrics();

  return (
    <>
      <PageTitle metadata={metadata} />
      <Text>many such cases...</Text>

      <Grid columns="1" gap="3" width="auto">
        <Card>
          <Heading size="5">Moderation</Heading>
          <Text className="block !mb-6" size="2" color="gray">
            Metrics indicating potential backlog in moderation queue.
          </Text>

          <Grid columns="3" gap="3" width="auto">
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Open Reports
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {openReports.length}
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Urgent Reports
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {reportUrgency.filter((x) => x).length}
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Active Cases <Badge color="purple">Beta</Badge>
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {openCases.length}
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Overdue Reports
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {overdueReports.length}{" "}
                <Text size="4" className="inline-block pt-2 align-top">
                  {overdueReports.length && "⚠️"}
                </Text>
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Overdue & Urgent
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {overdueAndUrgent.length}{" "}
                <Text size="4" className="inline-block pt-2 align-top">
                  {overdueAndUrgent.length && "‼️"}
                </Text>
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Stale Cases <Badge color="purple">Beta</Badge>
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {staleCases.length}{" "}
                <Text size="4" className="inline-block pt-2 align-top">
                  {staleCases.length && "⚠️"}
                </Text>
              </Text>
            </Box>
          </Grid>
        </Card>

        <Card>
          <Heading size="5">Discover Requests</Heading>
          <Text className="block !mb-6" size="2" color="gray">
            Metrics indicating potential backlog in discover queue.
          </Text>

          <Grid columns="3" gap="3" width="auto">
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Open Requests
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {openDiscoverRequests.length}
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Stale Requests
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {staleDiscoverRequests.length}{" "}
                <Text size="4" className="inline-block pt-2 align-top">
                  {staleDiscoverRequests.length && "⚠️"}
                </Text>
              </Text>
            </Box>
          </Grid>
        </Card>

        <Card>
          <Heading size="5">Support Team</Heading>
          <Text className="block !mb-6" size="2" color="gray">
            Metrics indicating potential backlog in support queue.
          </Text>

          <Grid columns="4" gap="3" width="auto">
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  New Tickets
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {zammadTicketMetrics.new}{" "}
                <Text size="4" className="inline-block pt-2 align-top">
                  {zammadTicketMetrics.new > 10 && "⚠️"}
                </Text>
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Pending Tickets
                </Text>
              </Flex>
              <Text size="8" weight="bold" color="gray">
                {zammadTicketMetrics.pending}
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Open Tickets
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {zammadTicketMetrics.open}
              </Text>
            </Box>
            <Box>
              <Flex>
                <Text size="1" color="gray">
                  Escalated Tickets
                </Text>
              </Flex>
              <Text size="8" weight="bold">
                {zammadTicketMetrics.escalated}{" "}
                <Text size="4" className="inline-block pt-2 align-top">
                  {zammadTicketMetrics.escalated &&
                    (zammadTicketMetrics.escalated > 10 ? "‼️" : "⚠️")}
                </Text>
              </Text>
            </Box>
          </Grid>
        </Card>
      </Grid>
    </>
  );
}
