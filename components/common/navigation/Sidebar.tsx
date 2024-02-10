"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ExitIcon,
  GroupIcon,
  HomeIcon,
  InfoCircledIcon,
  Link1Icon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  ReaderIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";

import { AuthorisedUserCard } from "./AuthorisedUserCard";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Flex gap="2" direction="column" className="w-[280px]">
      <img src="/wide.svg" className="h-8 m-4" />
      <AuthorisedUserCard />

      <Button
        variant={pathname === "/panel" ? "solid" : "surface"}
        className="!justify-start"
        asChild
      >
        <Link href="/panel">
          <HomeIcon /> Home
        </Link>
      </Button>
      <Button
        variant={pathname === "/panel/reports" ? "solid" : "surface"}
        className="!justify-start"
        asChild
      >
        <Link href="/panel/reports">
          <ReaderIcon /> Reports & Cases
        </Link>
      </Button>
      {/*<Button variant="surface" className="!justify-start">
        <PersonIcon />
        Team Members
      </Button>
      <Button variant="surface" className="!justify-start">
        <GroupIcon />
        Permissions & Groups
      </Button>
      <Button variant="surface" className="!justify-start">
        <Link1Icon />
        Integration Settings
      </Button>
      <Button variant="surface" className="!justify-start">
        <MagnifyingGlassIcon />
        Search by ID
      </Button>
      <Button variant="surface" className="!justify-start">
        <LockClosedIcon />
        Authifier
      </Button>
      <Button variant="surface" className="!justify-start">
        <TrashIcon />
        Nuked Content
      </Button> */}
      <Button
        variant={pathname === "/panel/about" ? "solid" : "surface"}
        className="!justify-start"
        asChild
      >
        <Link href="/panel/about">
          <InfoCircledIcon />
          About
        </Link>
      </Button>

      {/* <div className="w-[100%] border-t-[1px] border-t-gray" /> */}

      {/* {[
                  "Case: Server(s) ijghhjifg",
                  "Server: Balls!",
                  "User: userisreal",
                ].map((x, i) => (
                  <Flex
                    gap="2"
                    key={i}
                    className="overflow-hidden min-w-0 flex-shrink-0 hover-btn"
                  >
                    <Button
                      variant="outline"
                      className="whitespace-nowrap text-ellipsis overflow-hidden !block !flex-shrink flex-grow"
                    >
                      {x}
                    </Button>
                    <Button variant="outline" color="tomato" className="btn">
                      <Cross2Icon />
                    </Button>
                  </Flex>
                ))} */}
    </Flex>
  );
}
