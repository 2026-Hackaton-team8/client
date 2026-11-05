"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { consultationApi, errorMessage, type EquipmentResponse } from "@/shared/api";
import { Button, ButtonLink, Panel, TextArea } from "@/shared/ui";

type Props = {
  equipment: EquipmentResponse;
};

export function StartConsultationForm({ equipment }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const symptom = String(new FormData(event.currentTarget).get("symptom") ?? "").trim();
    if (!symptom) return;
    setPending(true);
    setError("");
    try {
      const consultation = await consultationApi.start(equipment.id, symptom);
      router.replace(`/consult/${consultation.id}`);
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-180">
      <Panel tone="outline" className="gap-5">
        <p className="flex flex-wrap gap-x-3 rounded-lg bg-secondary-50 px-4 py-3 text-body-md">
          <span className="font-semibold text-black">{equipment.name}</span>
          <span className="text-secondary-600">
            {equipment.model.code} · {equipment.location}
          </span>
        </p>
        <TextArea
          label="어떤 증상이 있나요?"
          name="symptom"
          rows={4}
          maxLength={255}
          required
          placeholder="예: 탈수 단계에서 멈추고 통에 물이 남아 있어요."
          hint="AI가 몇 가지를 더 물어보고 원인과 해결 방법을 찾아 드려요."
        />
        {error && (
          <p role="alert" className="text-body-sm text-primary-600">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <ButtonLink href="/" variant="ghost">
            취소
          </ButtonLink>
          <Button type="submit" variant="strong" disabled={pending}>
            {pending ? "상담을 시작하는 중…" : "상담 시작"}
          </Button>
        </div>
      </Panel>
    </form>
  );
}
