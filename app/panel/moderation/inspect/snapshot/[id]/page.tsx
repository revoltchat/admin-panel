import { PageTitle } from "@/components/common/navigation/PageTitle";
import { MessageList } from "@/components/core/revolt/messages/MessageList";
import { useScopedUser } from "@/lib/auth";
import { fetchMessages } from "@/lib/core";
import { snapshots } from "@/lib/db/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ScrollArea } from "@radix-ui/themes";

type Props = { params: { id: string } };

export const getSnapshot = cache(
  async (id: string) => await snapshots().findOne({ _id: id }),
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const snapshot = await getSnapshot(params.id);
  if (!snapshot)
    return {
      title: "Not Found",
    };

  return {
    title: `Snapshot of ${snapshot.content._type} ${snapshot.content._type === "User" ? `${snapshot.content.username}#${snapshot.content.discriminator}` : snapshot.content._type === "Server" ? snapshot.content.name : ""}`,
  };
}

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function Snapshot({ params }: Props) {
  await useScopedUser("*");

  const snapshot = await getSnapshot(params.id);
  if (!snapshot) return notFound();

  return <>display the snapshot details here!</>;
}
