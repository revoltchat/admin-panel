import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Case } from "@/components/core/admin/cases/Case";
import { Report } from "@/components/core/admin/reports/Report";
import { ReportGrouping } from "@/components/core/admin/reports/ReportGrouping";
import { useScopedUser } from "@/lib/auth";
import { RBAC_PERMISSION_MODERATION_AGENT } from "@/lib/auth/rbacInternal";
import {
  ReportDocument,
  SnapshotDocument,
  cases,
  channels,
  reports,
  servers,
  snapshots,
  users,
} from "@/lib/db/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Metadata } from "next";
import { Channel, Server } from "revolt-api";
import { decodeTime, ulid } from "ulid";

import { Flex } from "@radix-ui/themes";

dayjs.extend(relativeTime);

export const metadata: Metadata = {
  title: "Reports & Cases",
  description: "Browse active user reports and open cases.",
};

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function Reports() {
  await useScopedUser(RBAC_PERMISSION_MODERATION_AGENT);

  const list = await reports()
    .find(
      {
        status: "Created",
        case_id: {
          $exists: false,
        },
      },
      {
        sort: {
          _id: 1,
        },
      },
    )
    .toArray();

  const snapshotsByReport = await snapshots()
    .find({
      report_id: {
        $in: list.map((report) => report._id),
      },
    })
    .toArray()
    .then((arr) =>
      arr.reduce(
        (dict, value) => ({
          ...dict,
          [value.report_id]: [...(dict[value.report_id] ?? []), value],
        }),
        {} as Record<string, SnapshotDocument[]>,
      ),
    );

  const channelsById = await channels()
    .find({
      _id: {
        $in: list
          .map((report) =>
            snapshotsByReport[report._id].find(
              (snapshot) => snapshot.content._type === "Message",
            ),
          )
          .filter((snapshot) => snapshot)
          .map((snapshot) => {
            if (snapshot!.content._type === "Message") {
              return snapshot!.content.channel;
            } else {
              throw "unreachable";
            }
          }),
      },
    })
    .toArray()
    .then((arr) =>
      arr.reduce(
        (dict, value) => ({ ...dict, [value._id]: value }),
        {} as Record<string, Channel>,
      ),
    );

  const serversById = await servers()
    .find({
      _id: {
        $in: Object.keys(channelsById).filter(
          (id) => channelsById[id].channel_type === "TextChannel",
        ),
      },
    })
    .toArray()
    .then((arr) =>
      arr.reduce(
        (dict, value) => ({ ...dict, [value._id]: value }),
        {} as Record<string, Server>,
      ),
    );

  // Intelligent grouping code
  const lastDateByAuthorId: Record<string, [string, Date]> = {};

  // 1. Determine the possible groupings
  const groupings = list.map((report) => {
    const groups = new Set<string>();
    const types: Record<string, "Server" | "User" | "Group" | "Author"> = {};

    function add(id: string, type: "Server" | "User" | "Group" | "Author") {
      groups.add(id);
      types[id] = type;
    }

    for (const snapshot of snapshotsByReport[report._id]) {
      switch (snapshot.content._type) {
        case "Message":
          const channel = channelsById[snapshot.content.channel];
          if (channel) {
            if (channel.channel_type === "TextChannel") {
              const server = serversById[channel.server];
              if (server) {
                add(server.owner, "User");
                add(channel.server, "Server");
              }
            } else if (channel.channel_type === "Group") {
              add(channel._id, "Group");
            }
          }

          add(snapshot.content.author, "User");
          break;
        case "Server":
          add(snapshot.content.owner, "User");
          add(snapshot.content._id, "Server");
          break;
        case "User":
          add(snapshot.content._id, "User");
          break;
      }
    }

    // Also group mass reports together with lowest priority:
    // (and within 20 minutes of each other)
    if (lastDateByAuthorId[report.author_id]) {
      const reportDate = dayjs(decodeTime(report._id));
      const [_, lastReportDate] = lastDateByAuthorId[report.author_id];
      if (reportDate.diff(lastReportDate, "minutes") > 20)
        delete lastDateByAuthorId[report.author_id];
    }

    if (!lastDateByAuthorId[report.author_id]) {
      lastDateByAuthorId[report.author_id] = [
        ulid(),
        new Date(decodeTime(report._id)),
      ];
    }

    add(
      report.author_id + "-" + lastDateByAuthorId[report.author_id][0],
      "Author",
    );

    lastDateByAuthorId[report.author_id][1] = new Date(decodeTime(report._id));

    const SYSTEM_ID = "0".repeat(26);
    return [...groups]
      .filter((id) => id !== SYSTEM_ID)
      .map((id) => [id, types[id]] as const);
  });

  // 2. Calculate the counts for each grouping
  const groupCounts = {} as Record<string, number>;
  for (const groups of groupings) {
    for (const [group, _] of groups) {
      if (!groupCounts[group]) {
        groupCounts[group] = 0;
      }

      groupCounts[group]++;
    }
  }

  // 3. Group according to groups with > 1 elements AND whichever is the highest
  const grouped = { default: [] } as Record<string, ReportDocument[]>;
  const groupTypes = {} as Record<
    string,
    "Server" | "User" | "Group" | "Author"
  >;

  for (let i = 0; i < list.length; i++) {
    const groups = groupings[i];
    const scores = groups.map(([group, _]) => groupCounts[group]);

    if (Math.max(...scores) > 1) {
      const [winningGroup, groupType] =
        groups[scores.indexOf(Math.max(...scores))];
      if (!grouped[winningGroup]) grouped[winningGroup] = [];
      grouped[winningGroup].push(list[i]);
      groupTypes[winningGroup] = groupType;
    } else {
      grouped["default"].push(list[i]);
    }
  }

  // 4. Populate group names
  // O(n) complexity, fine for now
  const groupName = {} as Record<string, string>;
  for (const groupId of Object.keys(grouped)) {
    const [actualId] = groupId.split("-");
    if (groupId !== "default") {
      switch (groupTypes[groupId]) {
        case "Group":
          groupName[groupId] = `Reports in DM Group ${await channels()
            .findOne({
              _id: actualId,
            })
            .then((channel) =>
              channel?.channel_type === "Group" ? channel.name : null,
            )}`;
          break;
        case "Server":
          groupName[groupId] = `Reports in Server ${await servers()
            .findOne({ _id: actualId })
            .then((server) => server?.name)}`;
          break;
        case "User":
          groupName[groupId] = `Reports against ${await users()
            .findOne({ _id: actualId })
            .then(
              (user) =>
                user?.username +
                "#" +
                user?.discriminator +
                (user?.display_name ? ` (${user.display_name})` : ""),
            )}`;
          break;
        case "Author":
          groupName[groupId] = `Reports by ${await users()
            .findOne({ _id: actualId })
            .then(
              (user) =>
                user?.username +
                "#" +
                user?.discriminator +
                (user?.display_name ? ` (${user.display_name})` : ""),
            )}`;
          break;
      }
    }
  }

  // 5. Combine the two lists to show chronological order
  //    and bubble "urgent" reports to the top
  const uncategorised = grouped["default"];
  delete grouped["default"];
  const chronologicalReports = [
    ...uncategorised,
    ...Object.keys(grouped).map(
      (id) => [id, grouped[id]] as [string, ReportDocument[]],
    ),
  ].toSorted((a, b) => {
    const urgentA = Array.isArray(a)
      ? a[1].some((report) => report.content.report_reason.includes("Illegal"))
      : a.content.report_reason.includes("Illegal");

    if (urgentA) return -1;

    const aId = Array.isArray(a) ? a[1][0]._id : a._id;
    const bId = Array.isArray(b) ? b[1][0]._id : b._id;
    return aId.localeCompare(bId);
  });

  // Cases
  const allCases = await cases()
    .find({ status: "Open" }, { sort: { _id: 1 } })
    .toArray();

  return (
    <>
      <PageTitle metadata={metadata} />

      <Flex gap="2" direction="column" className="min-w-0">
        <h1 className="text-xl">Open Cases</h1>

        {allCases.map((cs) => (
          <Case cs={cs} />
        ))}

        <h1 className="text-xl">Reports</h1>

        {chronologicalReports.map((groupOrReport) =>
          Array.isArray(groupOrReport) ? (
            <ReportGrouping
              key={groupOrReport[0]}
              name={groupName[groupOrReport[0]]}
              reports={groupOrReport[1]}
              allowCaseCreation
            />
          ) : (
            <Report
              key={groupOrReport._id}
              report={groupOrReport}
              allowCaseCreation
            />
          ),
        )}
      </Flex>
    </>
  );
}
