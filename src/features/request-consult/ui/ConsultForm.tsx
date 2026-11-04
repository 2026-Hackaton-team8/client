"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Equipment } from "@/entities/equipment";
import { Button, ButtonLink, Chip, Select, TextArea } from "@/shared/ui";

type Props = {
  equipments: Equipment[];
  symptoms: string[];
};

export function ConsultForm({ equipments, symptoms }: Props) {
  const searchParams = useSearchParams();
  const preset = equipments.find((item) => item.id === searchParams?.get("equipment"));
  const [equipmentId, setEquipmentId] = useState((preset ?? equipments[0]).id);
  const [picked, setPicked] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const equipment = equipments.find((item) => item.id === equipmentId) ?? equipments[0];
  const canSubmit = picked.length > 0 || description.trim().length > 0;

  const toggleSymptom = (symptom: string) =>
    setPicked((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom],
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) setSubmitted(true);
  };

  const reset = () => {
    setPicked([]);
    setDescription("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <section
        aria-live="polite"
        className="flex flex-col items-start gap-6 rounded-lg bg-secondary-50 p-6"
      >
        <div className="flex flex-col gap-3.5">
          <h2 className="text-title-lg text-black">상담이 접수됐어요</h2>
          <p className="text-body-md text-secondary-700">
            요청번호 <span className="font-mono text-black">AS-1045</span> · {equipment.name} 상담이{" "}
            {equipment.maker} A/S 요청 기록으로 전달됐어요.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/equipment/${equipment.id}`} variant="soft" className="px-5">
            수리 내역 보기
          </ButtonLink>
          <Button variant="ghost" className="px-5" onClick={reset}>
            다시 작성
          </Button>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-lg bg-secondary-50 p-6">
      <Select
        label="설비"
        value={equipmentId}
        onChange={(event) => setEquipmentId(event.target.value)}
        options={equipments.map((item) => ({
          value: item.id,
          label: `${item.name} · ${item.serial}`,
        }))}
      />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-label-lg text-black">어떤 증상인가요?</legend>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <Chip
              key={symptom}
              selected={picked.includes(symptom)}
              onClick={() => toggleSymptom(symptom)}
            >
              {symptom}
            </Chip>
          ))}
        </div>
      </fieldset>
      <TextArea
        label="자세한 내용"
        placeholder="언제부터, 어떤 상황에서 생기는지 적어 주세요."
        hint="경고 코드가 있다면 함께 적어 주세요."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="flex justify-end gap-3">
        <ButtonLink href="/" variant="ghost" className="px-5">
          취소
        </ButtonLink>
        <Button type="submit" size="lg" disabled={!canSubmit}>
          상담 요청하기
        </Button>
      </div>
    </form>
  );
}
