import { Card, Flex, Heading, Theme } from "@radix-ui/themes";

import styles from "./home.module.css";

export default function NotFound() {
  return (
    <Theme appearance="dark" panelBackground="solid">
      <main
        className={
          styles.main + " h-[100vh] p-4 flex items-center justify-center"
        }
      >
        <Card className="p-4">
          <Flex direction="column" gap="4">
            <Heading as="h1" size="8">
              Page Not Found
            </Heading>
          </Flex>
        </Card>
      </main>
    </Theme>
  );
}
