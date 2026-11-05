"use client";

import { useState, type FormEvent } from "react";
import { errorMessage, makerApi, useApi } from "@/shared/api";
import { toLocalInputValue } from "@/shared/lib";
import { Button, Panel, Select, TextField } from "@/shared/ui";

type Props = {
  requestId: number;
  onAssigned: () => void;
};

// Default visit: tomorrow 14:00.
function defaultVisit() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(14, 0, 0, 0);
  return toLocalInputValue(date);
}

export function AssignEngineerForm({ requestId, onAssigned }: Props) {
  const engineers = useApi(makerApi.engineers, "engineers");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const options = (engineers.data ?? []).map((engineer) => ({
    value: String(engineer.id),
    label: `${engineer.name} · ${engineer.phone}`,
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await makerApi.assign(requestId, {
        engineerId: Number(data.get("engineerId")),
        // Local date-time without a zone, e.g. "2026-11-06T14:00:00".
        visitAt: `${data.get("visitAt")}:00`,
      });
      onAssigned();
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
  }

  return (
    <Panel title="엔지니어 배정" className="gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="엔지니어"
          name="engineerId"
          options={options}
          disabled={engineers.loading || options.length === 0}
          required
        />
        {engineers.data?.length === 0 && (
          <p className="text-body-sm text-secondary-600">배정할 수 있는 엔지니어가 없어요.</p>
        )}
        <TextField
          label="방문 일정"
          name="visitAt"
          type="datetime-local"
          defaultValue={defaultVisit()}
          required
        />
        {error && (
          <p role="alert" className="text-body-sm text-primary-600">
            {error}
          </p>
        )}
        <Button type="submit" block disabled={pending || options.length === 0}>
          {pending ? "배정하는 중…" : "배정하고 이용 기업에 알림"}
        </Button>
      </form>
    </Panel>
  );
}
