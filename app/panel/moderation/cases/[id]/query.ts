"use server";

import { cases, channels, reports, snapshots, users } from "@/lib/db/types";
import { cache } from "react";
import { Channel, User } from "revolt-api";

export const getCase = cache(
  async (id: string) => await cases().findOne({ _id: id }),
);

export async function getCaseAll(id: string) {
  const cs = await getCase(id);
  if (!cs)
    return {
      cs: null!,
      associatedReports: null!,
      associatedSnapshots: null!,
      messageAuthors: null!,
      messageChannels: null!,
      reporters: null!,
      // involvedUsers: null,
    };

  const associatedReports = await reports()
    .find({
      case_id: id,
    })
    .toArray();

  const associatedSnapshots = await snapshots()
    .find({
      report_id: {
        $in: associatedReports.map((report) => report._id),
      },
    })
    .toArray();

  const messageAuthors = await users()
    .find(
      {
        _id: {
          $in: associatedSnapshots
            .map((s) => s.content._type === "Message" && s.content.author)
            .filter((x) => x) as string[],
        },
      },
      {
        projection: {
          username: 1,
          discriminator: 1,
          avatar: 1,
        },
      },
    )
    .toArray()
    .then((arr) =>
      arr.reduce((d, v) => ({ ...d, [v._id]: v }), {} as Record<string, User>),
    );

  const messageChannels = await channels()
    .find(
      {
        _id: {
          $in: associatedSnapshots
            .map((s) => s.content._type === "Message" && s.content.channel)
            .filter((x) => x) as string[],
        },
      },
      {
        projection: {
          channel_type: 1,
          name: 1,
        },
      },
    )
    .toArray()
    .then((arr) =>
      arr.reduce(
        (d, v) => ({ ...d, [v._id]: v }),
        {} as Record<string, Channel>,
      ),
    );

  const reporters = await users()
    .find(
      {
        _id: {
          $in: associatedReports
            .map((s) => s.author_id)
            .filter((x) => x) as string[],
        },
      },
      {
        projection: {
          username: 1,
          discriminator: 1,
          avatar: 1,
        },
      },
    )
    .toArray();

  //
  // Determine everything we can action
  //

  // const involvedUsers = [
  //   ...associatedReports
  //     .map((report) =>
  //       report.content.type === "User"
  //         ? (report.content as never as User)
  //         : undefined,
  //     )
  //     .filter((x) => x),
  //   ...Object.keys(messageAuthors).map((id) => messageAuthors[id]),
  // ];

  return {
    cs,
    associatedReports,
    associatedSnapshots,
    messageAuthors,
    messageChannels,
    reporters,
    // involvedUsers,
  };
}
