import { PageTitle } from "@/components/common/navigation/PageTitle";
import { MessageList } from "@/components/core/revolt/messages/MessageList";
import { ServerCard } from "@/components/core/revolt/servers/ServerCard";
import { ServerInterface } from "@/components/core/revolt/servers/ServerInterface";
import { useScopedUser } from "@/lib/auth";
import { fetchMessages } from "@/lib/core";
import { users } from "@/lib/db/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ScrollArea } from "@radix-ui/themes";

type Props = { params: { id: string } };

export const getUser = cache(
  async (id: string) => await users().findOne({ _id: id }),
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const user = await getUser(params.id);
  if (!user)
    return {
      title: "Not Found",
    };

  return {
    title: `User: ${user.username}#${user.discriminator}`,
  };
}

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function User({ params }: Props) {
  await useScopedUser("*");

  const server = await getUser(params.id);
  if (!server) return notFound();

  const { messages: recentMessages, authors: recentMessageAuthors } =
    await fetchMessages({
      author: params.id,
    });

  return (
    <>
      <PageTitle
        metadata={{
          title: `Inspect User`,
        }}
      />

      <ScrollArea type="always" scrollbars="vertical" style={{ height: 360 }}>
        <MessageList messages={recentMessages} authors={recentMessageAuthors} />
      </ScrollArea>
    </>
  );
}
