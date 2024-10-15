import { LoginButton } from "@/components/common/auth/LoginButton";
import { Metadata } from "next";
import { Sixtyfour_Convergence } from "next/font/google";

import { Card, Flex, Heading, Text } from "@radix-ui/themes";

import styles from "./home.module.css";

const sixtyfourConvergence = Sixtyfour_Convergence({ subsets: ["latin"], weight: "700" });

export default function Home() {
  return (
    <main
      className={
        styles.main + " h-[100vh] p-4 flex items-center justify-center"
      }
    >
      <Card className="p-4">
        <Flex direction="column" gap="4">
          <Heading as="h1" size="8" className={sixtyfourConvergence.className}>
            Revolt Admin Panel
          </Heading>

          <LoginButton />

          <Text align="center" size="1">
            <a href="https://revolt.chat">revolt.chat</a> &middot;{" "}
            <a href="https://git.is.horse/revolt/research-development/swiss-army-knife">
              Project Information
            </a>
          </Text>
        </Flex>
      </Card>
    </main>
  );
}
