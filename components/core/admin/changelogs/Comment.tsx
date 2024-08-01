import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { decodeTime } from "ulid";

import { Avatar, Card, Flex, Text } from "@radix-ui/themes";

dayjs.extend(relativeTime);

export type CommentType = {
  icon: string;
  name: string;
  text: string;
};

export function Comment({
  id,
  comment: { icon, name, text },
}: {
  id: string;
  comment: CommentType;
}) {
  return (
    <Flex gap="2" direction="column">
      <Flex gap="2" align="center" wrap="wrap">
        <Avatar
          radius="full"
          fallback={name[0]}
          src={icon}
          style={{ backdropFilter: "blur(10px)" }}
        />
        <Text color="gray" size="2" suppressHydrationWarning>
          <Text color="plum">{name}</Text> commented{" "}
          {dayjs(decodeTime(id)).fromNow()}
        </Text>
      </Flex>
      <Card className="ml-12">
        {text.split("\n").map((text, idx) => (
          <div key={idx}>{text}</div>
        ))}
      </Card>
    </Flex>
  );
}
