import { Sidebar } from "@/components/common/navigation/Sidebar";

import { Flex } from "@radix-ui/themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8">
      <Flex gap="8">
        <div className="relative">
          <Sidebar />
        </div>

        <Flex direction="column" gap="2" grow="1">
          {children}
        </Flex>
      </Flex>
    </div>
  );
}
