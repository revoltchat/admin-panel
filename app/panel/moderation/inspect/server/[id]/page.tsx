import { PageTitle } from "@/components/common/navigation/PageTitle";
import { ServerCard } from "@/components/core/revolt/servers/ServerCard";
import { ServerInterface } from "@/components/core/revolt/servers/ServerInterface";
import { servers } from "@/lib/db/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

type Props = { params: { id: string } };

export const getServer = cache(
  async (id: string) => await servers().findOne({ _id: id }),
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const server = await getServer(params.id);
  if (!server)
    return {
      title: "Not Found",
    };

  return {
    title: `Server: ${server.name}`,
  };
}

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function Server({ params }: Props) {
  const server = await getServer(params.id);
  if (!server) return notFound();

  return (
    <>
      <PageTitle
        metadata={{
          title: `Inspect Server`,
        }}
      />
      <ServerCard server={server} />
      <ServerInterface server={server} />
    </>
  );
}
