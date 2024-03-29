import { NoEntries } from "@/components/common/data/NoEntries";
import dayjs from "dayjs";
import { Fragment } from "react";
import { Channel, Message as MessageType, User } from "revolt-api";
import { decodeTime } from "ulid";

import { Badge } from "@radix-ui/themes";

import { Message } from "./Message";

export function MessageList({
  messages,
  authors,
  channels,
}: {
  messages: MessageType[];
  authors: Record<string, User>;
  channels?: Record<string, Channel>;
}) {
  return (
    <>
      {messages.length === 0 && <NoEntries />}
      {messages.map((message, index) => {
        return (
          <Fragment key={message._id}>
            {index !== 0 &&
              new Date(decodeTime(message._id)).getDate() !==
                new Date(decodeTime(messages[index - 1]._id)).getDate() && (
                <Badge className="mt-2" color="gray">
                  {dayjs(decodeTime(message._id)).format("YYYY-MM-DD")}
                </Badge>
              )}

            <Message
              message={message}
              author={authors[message.author]}
              channel={channels?.[message.channel]}
            />
          </Fragment>
        );
      })}
    </>
  );
}
