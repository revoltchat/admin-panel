"use client";

import { useAuthorisedUser } from "@/lib/auth/user";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

import { Button, Flex } from "@radix-ui/themes";

export function LoginButton() {
  if (process.env.NEXT_PUBLIC_AUTH_TYPE === "none") {
    return (
      <Button color="ruby" asChild>
        <Link href="/panel">Continue as Instance Owner</Link>
      </Button>
    );
  }

  // eslint-disable-next-line
  const user = useAuthorisedUser(true);
  if (user) {
    return (
      <Flex gap="4">
        <Button className="flex-1" asChild>
          <Link href="/panel">Dashboard</Link>
        </Button>
        <Button color="ruby" className="flex-1" onClick={() => signOut()}>
          Log Out
        </Button>
      </Flex>
    );
  }

  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(document.location.search).get("callbackUrl") ??
        undefined
      : undefined;

  return (
    <Button
      onClick={() =>
        signIn("authentik", {
          callbackUrl,
        })
      }
    >
      Login with Revolt SSO
    </Button>
  );
}
