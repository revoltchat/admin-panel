"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { MagnifyingGlassIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Card,
  Flex,
  IconButton,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";

import { search } from "./actions";

export function Search() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["search", activeQuery],
    queryFn: () => search(activeQuery),
    enabled: Boolean(activeQuery),
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setActiveQuery(query);
  }

  return (
    <Flex gap="4" direction="column">
      <form onSubmit={submit}>
        <TextField.Root
          placeholder="Search for anything…"
          size="3"
          className="w-full"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
          <TextField.Slot pr="3">
            <IconButton size="2" variant="ghost" type="submit">
              <PaperPlaneIcon height="16" width="16" />
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </form>
      {isLoading ? (
        <Skeleton>
          <Card>
            <Flex gap="3" align="center">
              <Avatar size="3" fallback="" />
              <Box>
                <Text as="div" size="2" weight="bold">
                  Description of thing
                </Text>
                <Text as="div" size="2" color="gray">
                  Thing
                </Text>
              </Box>
            </Flex>
          </Card>
        </Skeleton>
      ) : data ? (
        data.length ? (
          data.map((result) => (
            <Link key={result.id} href={result.link}>
              <Card>
                <Flex gap="3" align="center">
                  <Avatar
                    size="3"
                    fallback={result.title.substring(0, 1).toUpperCase()}
                    src={result.iconURL}
                  />
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {result.title}
                    </Text>
                    <Text as="div" size="2" color="gray">
                      {result.type}
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </Link>
          ))
        ) : (
          "Couldn't find anything..."
        )
      ) : null}
    </Flex>
  );
}
