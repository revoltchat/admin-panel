"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  BackpackIcon,
  ExclamationTriangleIcon,
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
import { Badge, Button, Flex, Heading } from "@radix-ui/themes";

import { AuthorisedUserCard } from "./AuthorisedUserCard";

export function Sidebar({
  modules,
}: {
  modules: {
    hr: boolean;
    advancedPanel: boolean;
    modAgent: boolean;
    discoverAgent: boolean;
  };
}) {
  const pathname = usePathname();

  const params = useSearchParams();
  if (params.has("hideNav")) return null;

  return (
    <div className="relative">
      <Flex gap="2" direction="column" className="w-[280px]">
        <Image
          src="/wide.svg"
          width={240}
          height={32}
          className="m-4"
          alt="Logo"
        />
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
        {/* <Button
          variant={pathname === "/panel/profile" ? "solid" : "surface"}
          className="!justify-start"
          asChild
        >
          <Link href="/panel">
            <IdCardIcon /> My Profile
          </Link>
        </Button> -- WIP */}

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
            {/* <Button
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
            </Button> -- WIP */}
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
            {modules.advancedPanel && (
              <Button
                variant={pathname === "/panel/mod/legacy" ? "solid" : "surface"}
                className="!justify-start"
                asChild
              >
                <Link href="/panel/mod/legacy">
                  <InfoCircledIcon /> Overview
                </Link>
              </Button>
            )}
            <Button
              variant={
                pathname === "/panel/revolt/inspect" ? "solid" : "surface"
              }
              className="!justify-start"
              asChild
            >
              <Link href="/panel/revolt/inspect">
                <MagnifyingGlassIcon />
                Search by ID <Badge color="orange">🚧 WIP</Badge>
              </Link>
            </Button>
            {modules.advancedPanel && (
              <>
                <Button
                  variant={
                    pathname === "/panel/mod/legacy/create-report"
                      ? "solid"
                      : "surface"
                  }
                  className="!justify-start"
                  asChild
                >
                  <Link href="/panel/mod/legacy/create-report">
                    <ExclamationTriangleIcon /> Create Report
                  </Link>
                </Button>
                {modules.modAgent && (
                  <Button
                    variant={
                      pathname === "/panel/mod/legacy/reports"
                        ? "solid"
                        : "surface"
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
              </>
            )}
          </>
        )}
      </Flex>
    </div>
  );
}
