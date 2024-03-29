"use client";

import { CaseDocument } from "@/lib/db/types";
import { useState } from "react";

import { Button, Select, Text } from "@radix-ui/themes";

import { setReportCase } from "./actions";

export function AddReportContent({
  id,
  openCases,
}: {
  id: string;
  openCases: CaseDocument[];
}) {
  const [caseId, setCaseId] = useState<string>();
  const [applied, setApplied] = useState(false);

  if (applied) return <Text color="gray">Successfully assigned.</Text>;

  return (
    <>
      <Select.Root onValueChange={setCaseId}>
        <Select.Trigger placeholder="Select an open case to continue..." />
        <Select.Content>
          {openCases.map((cs) => (
            <Select.Item key={cs._id} value={cs._id}>
              {cs.title}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Button
        disabled={!caseId}
        onClick={async () => {
          await setReportCase(caseId!, id);
          setApplied(true);
        }}
      >
        Assign
      </Button>
    </>
  );
}
