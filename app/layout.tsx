import { ClientAuthProvider } from "@/lib/auth/clientProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Revolt Admin Panel",
  description: "Platform management and moderation tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <Theme appearance="dark" panelBackground="solid">
            {children}
          </Theme>
        </body>
      </html>
    </ClientAuthProvider>
  );
}
