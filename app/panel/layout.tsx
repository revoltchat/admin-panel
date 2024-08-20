import { Sidebar } from "@/components/common/navigation/Sidebar";
import { getUserWithScopes } from "@/lib/auth";
import {
  RBAC_PERMISSION_MODERATION_AGENT,
  RBAC_PERMISSION_MODERATION_DISCOVER,
} from "@/lib/auth/rbacInternal";
import { existsSync } from "node:fs";

import { Flex } from "@radix-ui/themes";

import styles from "./layout.module.css";

const HR_EXISTS = existsSync("app/panel/hr");
const MOD_EXISTS = existsSync("app/panel/mod");

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [_, scopes] = await getUserWithScopes([
    RBAC_PERMISSION_MODERATION_AGENT,
    RBAC_PERMISSION_MODERATION_DISCOVER,
  ]);

  return (
    <Flex className={`${styles.panel} min-h-[100vh]`}>
      <Sidebar
        modules={{
          hr: HR_EXISTS,
          advancedPanel: MOD_EXISTS,
          modAgent: MOD_EXISTS && scopes["moderation.agent"],
          discoverAgent: MOD_EXISTS && scopes["moderation.discover"],
        }}
      />

      <Flex direction="column" gap="2" flexGrow="1" className={styles.content}>
        {children}
      </Flex>
    </Flex>
  );
}
