"use client";

import { Case } from "@/components/core/admin/cases/Case";
import { Category } from "@/components/core/admin/cases/Category";
import { EvidencePreview } from "@/components/core/admin/cases/EvidencePreview";
import { RenameCase } from "@/components/core/admin/cases/RenameCase";
import { Resolution } from "@/components/core/admin/cases/Resolution";
import { setCaseStatus } from "@/components/core/admin/cases/actions";
import { Changelog } from "@/components/core/admin/changelogs/Changelog";
import { ReportGrouping } from "@/components/core/admin/reports/ReportGrouping";
import { useQuery } from "@tanstack/react-query";

import { Button, Flex, Grid, Heading, Text } from "@radix-ui/themes";

import { getCaseAll } from "./query";

export function HandleCaseContent({
  id,
  initialData,
}: {
  id: string;
  initialData: ReturnType<typeof getCaseAll> extends Promise<infer T>
    ? T
    : never;
}) {
  const { data } = useQuery({
    initialData,
    queryKey: [id],
    queryFn: () => getCaseAll(id),
  });

  const {
    cs,
    associatedReports,
    associatedSnapshots,
    messageAuthors,
    messageChannels,
    reporters,
  } = data!;

  return (
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
        <RenameCase id={id} title={cs.title} />
      </Flex>

      <Flex direction="column" gap="2">
        <Flex direction="column" gap="1">
          <Heading size="6">Evidence</Heading>
          <Text color="gray" size="1">
            Evidence gathered from report(s), click cards to view more details.
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

        <Category id={id} category={cs.category} />
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

        <Resolution
          id={id}
          status={cs.status}
          category={cs.category}
          title={cs.title}
          reporters={reporters}
        />
      </Flex>
    </Flex>
  );
}
