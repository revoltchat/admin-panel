import { ChangeLogDocument } from "@/lib/db/types";
import { queryClient } from "@/lib/query/queryProvider";

export async function consumeChangelog(
  changelog: ChangeLogDocument | Promise<ChangeLogDocument>,
) {
  const data = await changelog;
  queryClient.setQueryData(
    ["changelogs", data.object.id],
    (log: ChangeLogDocument[]) => [...log, data],
  );
}
