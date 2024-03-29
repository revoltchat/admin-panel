import { PageTitle } from "@/components/common/navigation/PageTitle";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { HandleCaseContent } from "./Content";
import { getCase, getCaseAll } from "./query";

type Props = { params: { id: string } };

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const cs = await getCase(params.id);
  if (!cs)
    return {
      title: "Not Found",
    };

  return {
    title: `Case: ${cs.title}`,
  };
}

/**
 * Must never statically generate this page as it contains dynamic content only
 */
export const dynamic = "force-dynamic";

export default async function HandleCase({ params }: Props) {
  const data = await getCaseAll(params.id);
  if (!data.cs) return notFound();

  return (
    <>
      <PageTitle metadata={{ title: "Handle Case" }} />
      <HandleCaseContent id={data.cs._id} initialData={data} />
    </>
  );
}
