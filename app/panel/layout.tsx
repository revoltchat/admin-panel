import { Sidebar } from "@/components/common/navigation/Sidebar";

import { Flex } from "@radix-ui/themes";

import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex className={`${styles.panel} min-h-[100vh]`}>
      <Sidebar />

      <Flex direction="column" gap="2" grow="1" className={styles.content}>
        {children}
      </Flex>
    </Flex>
  );
}
