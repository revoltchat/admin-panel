import { fetchMessages } from "@/lib/core";
import { channels, messages, users } from "@/lib/db/types";
import { Channel, Server, User } from "revolt-api";

import { ScrollArea } from "@radix-ui/themes";

import { Message } from "../messages/Message";
import { MessageList } from "../messages/MessageList";

import { ServerInterfaceTabs } from "./ServerInterfaceTabs";

export async function ServerInterface({ server }: { server: Server }) {
  // TODO: create client access token for this server

  const { messages: recentMessages, authors: recentMessageAuthors } =
    await fetchMessages({
      channel: {
        $in: server.channels,
      },
    });

  const serverChannels = await channels()
    .find({
      server: server._id,
    })
    .toArray()
    .then((arr) =>
      arr.reduce(
        (d, v) => ({ ...d, [v._id]: v as never }),
        {} as Record<
          string,
          Channel & {
            channel_type: "TextChannel" | "VoiceChannel";
          }
        >,
      ),
    );

  return (
    <ServerInterfaceTabs
      recentMessages={
        <MessageList
          messages={recentMessages}
          authors={recentMessageAuthors}
          channels={serverChannels}
        />
      }
      channels={serverChannels}
      categories={server.categories}
    />
  );
}
