"use client";

import { useState, type FormEvent } from "react";
import { Button, Panel, Select, TextField } from "@/shared/ui";

const engineers = [
  { value: "kim", label: "김엔지니어" },
  { value: "lee", label: "이엔지니어" },
  { value: "park", label: "박엔지니어" },
];

export function AssignEngineerForm() {
  const [assigned, setAssigned] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssigned(true);
  }

  return (
    <Panel title="엔지니어 배정" className="gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select label="엔지니어" options={engineers} disabled={assigned} />
        <TextField
          label="방문 일정"
          type="datetime-local"
          defaultValue="2026-11-06T14:00"
          disabled={assigned}
        />
        {assigned ? (
          <p role="status" className="rounded-lg bg-white px-4 py-3 text-label-lg text-primary-600">
            배정했어요. 이용 기업에 방문 일정을 알렸고, 방문일이 지나면 수리 기록을 작성할 수
            있어요.
          </p>
        ) : (
          <Button type="submit" block>
            배정하고 이용 기업에 알림
          </Button>
        )}
      </form>
    </Panel>
  );
}
