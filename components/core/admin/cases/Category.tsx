"use client";

import {
  TYPES_PROBLEM_WITH_CASE,
  TYPES_PROBLEM_WITH_CASE_KEYS,
  TYPES_VALID_CATEGORY,
  TYPES_VALID_CATEGORY_KEYS,
} from "@/lib/db/enums";
import type { CaseDocument } from "@/lib/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Badge, Button, Flex, Text } from "@radix-ui/themes";

import { consumeChangelog } from "../changelogs/helpers";

import { setCaseCategory } from "./actions";

export function Category({
  id,
  category,
}: {
  id: string;
  category: CaseDocument["category"];
}) {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async (cat: CaseDocument["category"][number]) => {
      let newCategory: CaseDocument["category"];
      if (TYPES_PROBLEM_WITH_CASE_KEYS.includes(cat as never)) {
        newCategory = [cat];
      } else {
        newCategory = [
          ...category.filter(
            (key) =>
              TYPES_VALID_CATEGORY_KEYS.includes(key as never) && cat !== key,
          ),
          ...(category.includes(cat) ? [] : [cat]),
        ];
      }

      await consumeChangelog(setCaseCategory(id, newCategory));
      return newCategory;
    },
    onSuccess(category) {
      queryClient.setQueryData([id], (data: { cs: CaseDocument }) => ({
        ...data,
        cs: {
          ...data.cs,
          category,
        },
      }));
    },
  });

  return (
    <>
      <Text color="iris" size="1">
        Problems with the case
      </Text>
      <Flex gap="2" wrap="wrap">
        {TYPES_PROBLEM_WITH_CASE_KEYS.map((type) => (
          <Badge
            color={category.includes(type) ? "iris" : "gray"}
            className={`!cursor-pointer${isPending ? " brightness-95" : ""}`}
            onClick={() => mutate(type)}
          >
            <b>{type}</b> {TYPES_PROBLEM_WITH_CASE[type]}
          </Badge>
        ))}
      </Flex>

      <Text color="iris" size="1">
        Reasons for acting on case
      </Text>
      <Flex gap="2" wrap="wrap">
        {TYPES_VALID_CATEGORY_KEYS.map((type) => (
          <Badge
            color={category.includes(type) ? "iris" : "gray"}
            className={`!cursor-pointer${isPending ? " brightness-95" : ""}`}
            onClick={() => mutate(type)}
          >
            <b>{type}</b> {TYPES_VALID_CATEGORY[type]}
          </Badge>
        ))}
      </Flex>
    </>
  );
}
