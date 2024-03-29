"use client";

import {
  CaseDocument,
  TYPES_PROBLEM_WITH_CASE,
  TYPES_PROBLEM_WITH_CASE_KEYS,
  TYPES_VALID_CATEGORY,
  TYPES_VALID_CATEGORY_KEYS,
} from "@/lib/db/types";
import { useState } from "react";

import { Badge, Button, Flex, Text } from "@radix-ui/themes";

export function Cat({
  initialCategory,
}: {
  initialCategory: CaseDocument["category"];
}) {
  const [selected, setSelected] = useState<CaseDocument["category"]>([]);

  return (
    <>
      <Text color="iris" size="1">
        Problems with the case
      </Text>
      <Flex gap="2" wrap="wrap">
        {TYPES_PROBLEM_WITH_CASE_KEYS.map((type) => (
          <Badge
            color={selected.includes(type) ? "iris" : "gray"}
            className="!cursor-pointer"
            onClick={() => setSelected([type])}
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
            color={selected.includes(type) ? "iris" : "gray"}
            className="!cursor-pointer"
            onClick={() =>
              setSelected((selected) => [
                ...selected.filter(
                  (key) =>
                    !TYPES_PROBLEM_WITH_CASE_KEYS.includes(key as never) &&
                    type !== key,
                ),
                ...(selected.includes(type) ? [] : [type]),
              ])
            }
          >
            <b>{type}</b> {TYPES_VALID_CATEGORY[type]}
          </Badge>
        ))}
      </Flex>

      <Button className="save">Update</Button>
    </>
  );
}
