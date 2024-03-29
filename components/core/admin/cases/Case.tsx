import { CaseDocument } from "@/lib/db/types";
import dayjs from "dayjs";
import Link from "next/link";
import { decodeTime } from "ulid";

import { Avatar, Badge, Card, Flex, Text } from "@radix-ui/themes";

export function Case({ cs }: { cs: CaseDocument }) {
  const caseOpenedTime = dayjs(decodeTime(cs._id));
  const staleReport = dayjs().diff(caseOpenedTime, "d") > 3;
  const significantlyStaleReport = dayjs().diff(caseOpenedTime, "d") > 14;

  return (
    <Link href={`/panel/moderation/cases/${cs._id}`}>
      <Card key={cs._id}>
        <Flex gap="2" grow="1" wrap="wrap">
          <Text as="div" size="2" weight="bold">
            {cs.title}
          </Text>
          <Text as="div" size="2">
            <Badge
              color={
                significantlyStaleReport
                  ? "red"
                  : staleReport
                    ? "orange"
                    : "gray"
              }
            >
              {dayjs(decodeTime(cs._id)).fromNow()}
            </Badge>{" "}
            &middot;{" "}
            <Avatar
              className="max-w-3 max-h-3"
              fallback={<Text size="1">{cs.author[0]}</Text>}
              radius="full"
            />{" "}
            <Text color="gray">{cs.author}</Text>
          </Text>
        </Flex>
      </Card>
    </Link>
  );
}
