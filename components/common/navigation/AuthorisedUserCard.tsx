"use client";

import { useAuthorisedUser } from "@/lib/auth/user";
import { signOut } from "next-auth/react";

import { ExitIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Card, Flex, IconButton, Text } from "@radix-ui/themes";

export function AuthorisedUserCard() {
  const { name, email, image, usingNextAuth } = useAuthorisedUser();

  return (
    <Card>
      <Flex gap="3" align="center">
        <Avatar size="3" src={image} radius="full" fallback="T" />
        <Box flexGrow="1">
          <Text as="div" size="2" weight="bold">
            {name}
          </Text>
          <Text as="div" size="2" color="gray">
            {email} {/* or we can show top-most role */}
          </Text>
        </Box>
        {usingNextAuth && (
          <IconButton color="ruby" onClick={() => signOut()}>
            <ExitIcon />
          </IconButton>
        )}
      </Flex>
    </Card>
  );
}
