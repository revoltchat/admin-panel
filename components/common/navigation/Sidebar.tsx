"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  BackpackIcon,
  GlobeIcon,
  GroupIcon,
  HomeIcon,
  IdCardIcon,
  InfoCircledIcon,
  Link1Icon,
  MagnifyingGlassIcon,
  PersonIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Heading } from "@radix-ui/themes";

import { AuthorisedUserCard } from "./AuthorisedUserCard";

export function Sidebar({
  modules,
}: {
  modules: { hr: boolean; modAgent: boolean; discoverAgent: boolean };
}) {
  const params = useSearchParams();
  if (params.has("hideNav")) return null;

  const pathname = usePathname();

  return (
    <div className="relative">
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
          variant={pathname === "/panel/profile" ? "solid" : "surface"}
          className="!justify-start"
          asChild
        >
          <Link href="/panel">
            <IdCardIcon /> My Profile
          </Link>
        </Button>

        {modules.hr && (
          <>
            <Heading size="2" color="gray" className="pt-4">
              Human Resources
            </Heading>
            <Button
              variant={pathname === "/panel/hr/team" ? "solid" : "surface"}
              className="!justify-start"
              asChild
            >
              <Link href="/panel/hr/team">
                <PersonIcon />
                Team Members
              </Link>
            </Button>
            <Button
              variant={pathname === "/panel/hr/positions" ? "solid" : "surface"}
              className="!justify-start"
              asChild
            >
              <Link href="/panel/hr/positions">
                <BackpackIcon />
                Positions
              </Link>
            </Button>
            <Button
              variant={pathname === "/panel/hr/rbac" ? "solid" : "surface"}
              className="!justify-start"
              asChild
            >
              <Link href="/panel/hr/rbac">
                <GroupIcon />
                Roles & Permissions
              </Link>
            </Button>
            {/* <Button
          variant={pathname === "/panel/hr/integrations" ? "solid" : "surface"}
          className="!justify-start"
          asChild
        >
          <Link href="/panel/hr/integrations">
            <Link1Icon />
            Integration Settings
          </Link>
        </Button> */}
          </>
        )}

        {(modules.modAgent || modules.discoverAgent) && (
          <>
            <Heading size="2" color="gray" className="pt-4">
              Content Moderation
            </Heading>
            <Button
              variant={pathname === "/panel/mod/legacy" ? "solid" : "surface"}
              className="!justify-start"
              asChild
            >
              <Link href="/panel/mod/legacy">
                <InfoCircledIcon /> Overview
              </Link>
            </Button>
            {modules.modAgent && (
              <Button
                variant={
                  pathname === "/panel/mod/legacy/reports" ? "solid" : "surface"
                }
                className="!justify-start"
                asChild
              >
                <Link href="/panel/mod/legacy/reports">
                  <ReaderIcon /> Reports & Cases
                </Link>
              </Button>
            )}
            {modules.discoverAgent && (
              <Button
                variant={
                  pathname === "/panel/mod/legacy/discover"
                    ? "solid"
                    : "surface"
                }
                className="!justify-start"
                asChild
              >
                <Link href="/panel/mod/legacy/discover">
                  <GlobeIcon />
                  Discover
                </Link>
              </Button>
            )}
            {/* <Button
          variant={
            pathname === "/panel/mod/legacy/inspect" ? "solid" : "surface"
          }
          className="!justify-start"
          asChild
        >
          <Link href="/panel/mod/legacy/inspect">
            <MagnifyingGlassIcon />
            Search by ID
          </Link>
        </Button> */}
          </>
        )}
      </Flex>
    </div>
  );
}
