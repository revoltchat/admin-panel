"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Channel, Message as MessageType, User } from "revolt-api";
import { decodeTime } from "ulid";

import { Avatar, Badge, Box, Flex, Text } from "@radix-ui/themes";

import { redeleteAttachment, undeleteAttachment } from "./actions";

dayjs.extend(relativeTime);

export function Message({
  message,
  author,
  channel,
  compact,
}: {
  message: MessageType;
  author?: User;
  channel?: Channel;
  compact?: boolean;
}) {
  const channelName = channel
    ? channel.channel_type === "TextChannel"
      ? "#" + channel.name
      : ""
    : undefined;

  const elements = {
    timeSent: (
      <Text
        color="gray"
        size="1"
        className="flex-shrink-0 py-1 h-fit"
        aria-label={
          dayjs(decodeTime(message._id)).format("YYYY-MM-DD HH:mm:ss") +
          " (" +
          dayjs(decodeTime(message._id)).fromNow() +
          ")"
        }
        data-balloon-pos="right"
      >
        {dayjs(decodeTime(message._id)).format("HH:mm")}
      </Text>
    ),
    channel: channel && (
      <Text
        color="gray"
        size="1"
        className="overflow-hidden min-w-0 text-ellipsis whitespace-nowrap"
      >
        {channelName}
      </Text>
    ),
    author: author && (
      <Text
        color="gray"
        size={compact ? "1" : "2"}
        className="overflow-hidden min-w-0 text-ellipsis whitespace-nowrap"
      >
        {compact && (
          <>
            <Avatar
              className="max-w-3 max-h-3 mt-[-2px]"
              fallback={<Text size="1">{author.username[0]}</Text>}
              src={
                author.avatar
                  ? `https://autumn.revolt.chat/avatars/${author.avatar._id}`
                  : undefined
              }
              radius="full"
            />{" "}
          </>
        )}
        {author.username}#{author.discriminator}
      </Text>
    ),
    content: (
      <Flex
        className="flex-grow min-w-0 overflow-hidden text-wrap whitespace-pre-wrap"
        direction="column"
      >
        <Box className="w-full min-w-0">
          <Text size="2">
            {message.content
              ?.split("\n")
              .map((text) => <div>{text.trim()}</div>)}
          </Text>
        </Box>
        {message.attachments?.map((attachment) => (
          <Flex direction="column">
            <Text color="iris">
              {attachment.filename} ({attachment.size} bytes)
            </Text>
            {attachment.metadata.type === "Image" ? (
              <img
                id={attachment._id}
                className="max-w-[240px]"
                src={`https://autumn.revolt.chat/attachments/${attachment._id}`}
                onClick={async (e) => {
                  const loaded =
                    e.currentTarget.complete &&
                    e.currentTarget.naturalHeight !== 0;

                  e.stopPropagation();

                  const url = e.currentTarget.src;
                  if (!loaded) await undeleteAttachment(attachment._id);

                  window.open(`${url}?t=${Date.now()}`, "_blank");

                  if (!loaded)
                    setTimeout(() => redeleteAttachment(attachment._id), 1000);
                }}
              />
            ) : attachment.metadata.type === "Video" ? (
              <video
                className="max-w-[240px]"
                src={`https://autumn.revolt.chat/attachments/${attachment._id}`}
                controls
              />
            ) : (
              <Text color="gray">{attachment.content_type}</Text>
            )}
          </Flex>
        ))}
        {message.embeds?.map((embed) =>
          embed.type === "Image" ? (
            <Flex direction="column">
              <Text color="iris" size="1">
                {embed.url}
              </Text>
              <img
                className="max-w-[240px]"
                src={`https://jan.revolt.chat/proxy?url=${encodeURIComponent(embed.url)}`}
              />
            </Flex>
          ) : embed.type === "Video" ? null : null,
        )}
      </Flex>
    ),
  };

  if (compact)
    return (
      <Flex className="min-w-0" gap="2">
        {elements.timeSent}

        <Flex
          gap="2"
          justify="between"
          className={`${channel && author ? "w-[240px]" : "w-[160px]"} min-w-0 my-1 h-fit flex-shrink-0`}
        >
          {elements.channel}
          {elements.author}
        </Flex>

        {elements.content}
      </Flex>
    );

  return (
    <Flex gap="2">
      {author && (
        <Avatar
          className="flex-shrink-0"
          fallback={<Text size="1">{author.username[0]}</Text>}
          src={
            author.avatar
              ? `https://autumn.revolt.chat/avatars/${author.avatar._id}`
              : undefined
          }
          radius="full"
        />
      )}

      <Flex direction="column">
        <Flex gap="2" align="center">
          {elements.author}
          {elements.timeSent && (
            <Badge className="h-4" color="gray">
              {elements.timeSent}
            </Badge>
          )}
          {elements.channel && (
            <Badge className="h-4" color="gray">
              {elements.channel}
            </Badge>
          )}
        </Flex>

        {elements.content}
      </Flex>
    </Flex>
  );
}
