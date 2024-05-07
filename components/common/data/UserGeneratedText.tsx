"use client";

import { useLayoutEffect, useState } from "react";

export function UserGeneratedText({ content }: { content?: string }) {
  const [display, setDisplay] = useState(false);
  useLayoutEffect(() => setDisplay(true), []);

  return display ? <>{content}</> : null;
}
