"use client";

import { useState } from "react";

import { Button } from "@radix-ui/themes";

import { escalate } from "./actions";

export function TempEscalateReport({
  id,
  escalated,
}: {
  id: string;
  escalated?: boolean;
}) {
  const [es, setE] = useState(escalated);
  return (
    <Button
      size="1"
      color="ruby"
      variant="soft"
      disabled={es}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        escalate(id).then(() => setE(true));
      }}
    >
      {es ? "Escalated" : "Escalate"}
    </Button>
  );
}
