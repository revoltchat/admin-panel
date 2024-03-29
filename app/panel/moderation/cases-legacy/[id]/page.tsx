import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Case } from "@/components/core/admin/cases/Case";
import { EvidencePreview } from "@/components/core/admin/cases/EvidencePreview";
import { Changelog } from "@/components/core/admin/changelogs/Changelog";
import { ReportGrouping } from "@/components/core/admin/reports/ReportGrouping";
import { cases, channels, reports, snapshots, users } from "@/lib/db/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Channel, User } from "revolt-api";

import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Badge, Button, Flex, Grid, Heading, Text } from "@radix-ui/themes";

import { Cat } from "./Cat";
import { S } from "./S";

dayjs.extend(relativeTime);

type Props = { params: { id: string } };

export const getCase = cache(
  async (id: string) => await cases().findOne({ _id: id }),
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const cs = await getCase(params.id);
  if (!cs)
    return {
      title: "Not Found",
    };

  return {
    title: `Case: ${cs.title}`,
  };
}

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function HandleCase({ params }: Props) {
  const cs = await getCase(params.id);
  if (!cs) return notFound();

  const associatedReports = await reports()
    .find({
      case_id: params.id,
    })
    .toArray();

  const associatedSnapshots = await snapshots()
    .find({
      report_id: {
        $in: associatedReports.map((report) => report._id),
      },
    })
    .toArray();

  const messageAuthors = await users()
    .find(
      {
        _id: {
          $in: associatedSnapshots
            .map((s) => s.content._type === "Message" && s.content.author)
            .filter((x) => x) as string[],
        },
      },
      {
        projection: {
          username: 1,
          discriminator: 1,
        },
      },
    )
    .toArray()
    .then((arr) =>
      arr.reduce((d, v) => ({ ...d, [v._id]: v }), {} as Record<string, User>),
    );

  const messageChannels = await channels()
    .find(
      {
        _id: {
          $in: associatedSnapshots
            .map((s) => s.content._type === "Message" && s.content.channel)
            .filter((x) => x) as string[],
        },
      },
      {
        projection: {
          channel_type: 1,
          name: 1,
        },
      },
    )
    .toArray()
    .then((arr) =>
      arr.reduce(
        (d, v) => ({ ...d, [v._id]: v }),
        {} as Record<string, Channel>,
      ),
    );

  //
  // Determine everything we can action
  //

  const involvedUsers = [
    ...associatedReports
      .map((report) =>
        report.content.type === "User"
          ? (report.content as never as User)
          : undefined,
      )
      .filter((x) => x),
    ...Object.keys(messageAuthors).map((id) => messageAuthors[id]),
  ];

  return (
    <>
      <PageTitle metadata={{ title: "Handle Case" }} />
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2">
          <Case cs={cs} />
          <Flex direction="column" gap="6">
            <ReportGrouping
              name="Report(s) included in this case"
              reports={associatedReports}
              collapsible
            />
          </Flex>
          {/** TODO: option to add other reports */}
        </Flex>

        <Flex direction="column" gap="2">
          <Flex direction="column" gap="1">
            <Heading size="6">Evidence</Heading>
            <Text color="gray" size="1">
              Evidence gathered from report(s), click cards to view more
              details.
            </Text>
            {/*<Text color="gray" size="1">
              Select{" "}
              <Badge color="gray" className="align-middle">
                <Cross2Icon /> Data
              </Badge>{" "}
              badges to fetch additional information after justifying why.
            </Text>
            <Text color="gray" size="1">
              Select{" "}
              <Badge color="iris" className="align-middle">
                <CheckIcon /> Data
              </Badge>{" "}
              badges to generate further snapshots.
            </Text>*/}
          </Flex>

          <Grid columns={{ initial: "1", md: "2" }} gap="3" width="100%">
            {associatedSnapshots.map((snapshot) => (
              <EvidencePreview
                key={snapshot._id}
                snapshot={snapshot}
                messageAuthors={messageAuthors}
                messageChannels={messageChannels}
              />
            ))}
          </Grid>
        </Flex>

        {/* <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Additional Evidence</Heading>
            <Text color="gray" size="1">
              Evidence manually added by moderators, click to view more details.
            </Text>
          </Flex>

          <Grid columns={{ initial: "1", md: "2" }} gap="3" width="auto">
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
          </Grid>
        </Flex> */}

        <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Discuss</Heading>
            <Text color="gray" size="1">
              View recent actions and comments relating to this case.
            </Text>
          </Flex>

          <Changelog object={{ type: "Case", id: cs._id }} />
        </Flex>

        <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Categorise</Heading>
            <Text color="gray" size="1">
              Choose what merit this case holds, please select all that apply.
            </Text>
          </Flex>

          <Cat />
        </Flex>

        <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Act</Heading>
            <Text color="gray" size="1">
              Take action against user(s) and other content.
            </Text>
          </Flex>

          <S />
        </Flex>

        <Flex direction="column" gap="2">
          <Flex direction="column">
            <Heading size="6">Resolution</Heading>
            <Text color="gray" size="1">
              Determine a resolution to the report(s).
            </Text>
            <Text color="gray" size="1">
              Once you've acted on the report, you can close it here.
            </Text>
          </Flex>

          <Text>TODO: send out notification that report has been resolved</Text>

          {/*<Button onClick={() => }>Close Case</Button>*/}
        </Flex>
      </Flex>
    </>
  );
}
