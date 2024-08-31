"use client";

import { Loading } from "@/components/common/data/Loading";
import { NoEntries } from "@/components/common/data/NoEntries";
import { emailToImage } from "@/lib/auth/user";
import { ChangeLogDocument } from "@/lib/db/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ComponentProps, ReactNode } from "react";
import { decodeTime } from "ulid";

import {
  ArchiveIcon,
  BadgeIcon,
  CheckIcon,
  Cross1Icon,
  Cross2Icon,
  DashIcon,
  PaperPlaneIcon,
  PlusIcon,
  TextIcon,
  ValueNoneIcon,
} from "@radix-ui/react-icons";
import { Avatar, Badge, Card, Flex, Text } from "@radix-ui/themes";

import { Comment } from "./Comment";
import { WriteComment } from "./WriteComment";
import { getChangelogEntries } from "./actions";

dayjs.extend(relativeTime);

type RenderOutput =
  | {
      type: "short";
      icon: NonNullable<ReactNode>;
      color: ComponentProps<typeof Avatar>["color"];
      description: ReactNode;
      card?: ReactNode;
    }
  | {
      type: "comment";
      icon: string;
      name: string;
      text: string;
    };

type Renderers = {
  [T in ChangeLogDocument["type"]]: (
    change: ChangeLogDocument & { type: T },
  ) => RenderOutput;
};

const ChangeRenderer: Renderers = {
  comment: (change) => ({
    type: "comment",
    icon: emailToImage(change.userEmail),
    name: change.userEmail,
    text: change.text,
  }),
  "bot/discover/approve": (change) => ({
    type: "short",
    icon: <CheckIcon />,
    color: "green",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> approved this bot to be
        listed on Discover
      </>
    ),
  }),
  "bot/discover/reject": (change) => ({
    type: "short",
    icon: <Cross1Icon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text>
        <Text
          className="underline"
          aria-label={change.reason}
          data-balloon-pos="up"
        >
          rejected
        </Text>{" "}
        this bot&apos;s request to be listed on Discover
      </>
    ),
  }),
  "bot/discover/delist": (change) => ({
    type: "short",
    icon: <Cross1Icon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text>{" "}
        <Text
          className="underline"
          aria-label={change.reason}
          data-balloon-pos="up"
        >
          delisted
        </Text>{" "}
        this bot from Discover
      </>
    ),
  }),
  "server/discover/approve": (change) => ({
    type: "short",
    icon: <CheckIcon />,
    color: "green",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> approved this server to be
        listed on Discover
      </>
    ),
  }),
  "server/discover/reject": (change) => ({
    type: "short",
    icon: <Cross1Icon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text>{" "}
        <Text
          className="underline"
          aria-label={change.reason}
          data-balloon-pos="up"
        >
          rejected
        </Text>{" "}
        this server&apos;s request to be listed on Discover
      </>
    ),
  }),
  "server/discover/delist": (change) => ({
    type: "short",
    icon: <Cross1Icon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text>{" "}
        <Text
          className="underline"
          aria-label={change.reason}
          data-balloon-pos="up"
        >
          delisted
        </Text>{" "}
        this server from Discover
      </>
    ),
  }),
  "case/categorise": (change) => ({
    type: "short",
    icon: <BadgeIcon />,
    color: "bronze",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> categorised this as{" "}
        {change.category.map((cat) => (
          <>
            <Badge key={cat} color="bronze">
              {cat}
            </Badge>{" "}
          </>
        ))}
      </>
    ),
  }),
  "case/status": (change) => ({
    type: "short",
    icon: change.status === "Open" ? <PlusIcon /> : <DashIcon />,
    color: change.status === "Open" ? "green" : "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text>{" "}
        {change.status === "Open" ? "opened" : "closed"} this
      </>
    ),
  }),
  "case/title": (change) => ({
    type: "short",
    icon: <TextIcon />,
    color: "blue",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> changed the title to{" "}
        <Text color="blue">{change.title}</Text>
      </>
    ),
  }),
  "case/add_report": (change) => ({
    type: "short",
    icon: <TextIcon />,
    color: "blue",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> added a report
      </>
    ),
  }),
  "case/notify": (change) => ({
    type: "short",
    icon: <PaperPlaneIcon />,
    color: "iris",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> sent a notification to{" "}
        {change.userIds.length} users
      </>
    ),
    card: (
      <>
        {change.content.split("\n").map((text, idx) => (
          <div key={idx}>{text.trim()}</div>
        ))}
      </>
    ),
  }),
  "user/strike": (change) => ({
    type: "short",
    icon: <ValueNoneIcon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> created a strike for{" "}
        <Text color="blue">{change.reason.join(", ")}</Text>
      </>
    ),
  }),
  "user/suspend": (change) => ({
    type: "short",
    icon: <ValueNoneIcon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> suspended this user for{" "}
        <Text color="blue">{change.reason.join(", ")}</Text>
      </>
    ),
  }),
  "user/ban": (change) => ({
    type: "short",
    icon: <ValueNoneIcon />,
    color: "red",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> banned this user for{" "}
        <Text color="blue">{change.reason.join(", ")}</Text>
      </>
    ),
  }),
  "user/export": (change) => ({
    type: "short",
    icon: <ArchiveIcon />,
    color: "bronze",
    description: (
      <>
        <Text color="plum">{change.userEmail}</Text> created an export of{" "}
        <Text color="blue">{change.exportType}</Text> type
      </>
    ),
  }),
};

export function Changelog({ object }: { object: ChangeLogDocument["object"] }) {
  const { data: changes } = useQuery({
    queryKey: ["changelogs", object.id],
    queryFn: () => getChangelogEntries(object.id),
  });

  return (
    <div className="overflow-hidden">
      {changes?.length ? (
        <div className="relative">
          <div className="absolute -z-10 bg-gray-500 w-[2px] h-[10000px] top-[-10px] left-[1.2rem]"></div>
        </div>
      ) : null}

      <Flex direction="column" gap="2">
        {changes ? changes.length === 0 && <NoEntries /> : <Loading />}

        {changes?.map((change) => {
          // @ts-expect-error too complicated for Typescript
          const result: RenderOutput = ChangeRenderer[change.type](change);

          if (result.type === "short") {
            const { icon, color, description, card } = result;
            return (
              <Flex key={change._id} gap="2" direction="column">
                <Flex gap="2" align="center">
                  <Avatar
                    radius="full"
                    fallback={icon}
                    color={color}
                    style={{ backdropFilter: "blur(10px)" }}
                  />
                  <Text color="gray" size="2">
                    {description}{" "}
                    <Badge color="gray" suppressHydrationWarning>
                      {dayjs(decodeTime(change._id)).fromNow()}
                    </Badge>
                  </Text>
                </Flex>
                {card && <Card className="ml-12">{card}</Card>}
              </Flex>
            );
          } else {
            return (
              <Comment key={change._id} id={change._id} comment={result} />
            );
          }
        })}

        <WriteComment object={object} />
      </Flex>
    </div>
  );
}
