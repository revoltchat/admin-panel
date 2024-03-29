import { useEffect, useState } from "react";
import { Channel, Message, Server, User } from "revolt-api";

import { Badge, Button, Flex, Heading, ScrollArea } from "@radix-ui/themes";

import { MessageList } from "../messages/MessageList";
import { fetchMessagesInChannel } from "../messages/actions";

type ServerChannel = Channel & { channel_type: "TextChannel" | "VoiceChannel" };

export function ServerBrowser({
  channels,
  categories,
}: {
  channels: Record<string, ServerChannel>;
  categories: Server["categories"];
}) {
  const [channel, setChannel] = useState<ServerChannel>();
  const [data, setData] = useState<{
    messages: Message[];
    authors: Record<string, User>;
  }>();

  useEffect(() => {
    if (channel) {
      setData(undefined);
      fetchMessagesInChannel(channel._id).then(setData);
    }
  }, [channel]);

  // Generate category layout
  const U = new Set<string>(Object.keys(channels));
  const C = [];

  if (categories) {
    for (const category of categories) {
      category.channels.forEach((id) => U.delete(id));
      C.push(category);
    }
  }

  if (U.size) {
    let defaultCategory = C.find((cat) => cat.id === "default");
    if (!defaultCategory) {
      defaultCategory = {
        id: "default",
        title: "Default",
        channels: [],
      };

      C.unshift(defaultCategory);
    }

    defaultCategory.channels = [...defaultCategory.channels, ...U];
  }

  return (
    <Flex gap="4" className="min-w-0">
      <Flex gap="4" direction="column" className="flex-shrink-0">
        {C.map((category) => (
          <Flex gap="2" direction="column">
            <Badge color="gray">{category.title}</Badge>
            {category.channels.map((id) =>
              channels[id] ? (
                <Button
                  size="1"
                  variant="ghost"
                  key={channels[id]._id}
                  onClick={() => setChannel(channels[id])}
                  disabled={channels[id].channel_type === "VoiceChannel"}
                >
                  #{channels[id].name}
                </Button>
              ) : (
                <Button size="1" variant="ghost" disabled>
                  Invalid Channel
                </Button>
              ),
            )}
          </Flex>
        ))}
      </Flex>
      <Flex gap="2" direction="column" className="flex-grow min-w-0">
        <Heading size="4" color="gray">
          {channel ? `#${channel.name}` : "No channel selected."}
        </Heading>

        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "480px" }}
        >
          {data && channel && (
            <MessageList
              messages={data.messages}
              authors={data.authors}
              channels={{}}
            />
          )}
        </ScrollArea>
      </Flex>
    </Flex>
  );
}
