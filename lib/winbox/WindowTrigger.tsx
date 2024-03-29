"use client";

import { ReactNode } from "react";

export function WindowTrigger({
  url,
  title,
  children,
}: {
  url: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <a
      className="!inline-flex h-fit"
      style={{
        alignItems: "center",
      }}
      onClick={(e) => {
        e.stopPropagation();
        new window.WinBox(title, {
          url,
        });
      }}
    >
      {children}
    </a>
  );
}
