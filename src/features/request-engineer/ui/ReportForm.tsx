"use client";

import { useState, type FormEvent } from "react";
import type { Consultation } from "@/entities/consultation";
import type { Equipment } from "@/entities/equipment";
import {
  Badge,
  Button,
  ButtonLink,
  OptionGroup,
  Panel,
  Placeholder,
  TextArea,
  TextField,
} from "@/shared/ui";

type Props = {
  consultation: Consultation;
  equipment: Equipment;
};

const machineStates = [
  { value: "stopped", label: "완전히 멈춤" },
  { value: "partial", label: "일부만 가동" },
  { value: "running", label: "정상 가동" },
];

const urgencies = [
  { value: "high", label: "긴급", description: "생산 중단" },
  { value: "mid", label: "보통", description: "며칠 내" },
  { value: "low", label: "낮음", description: "여유 있음" },
];

export function ReportForm({ consultation, equipment }: Props) {
  const [machineState, setMachineState] = useState("stopped");
  const [urgency, setUrgency] = useState("high");
  const [summary, setSummary] = useState(
    `증상: ${consultation.symptom}\n좁힌 원인: ${consultation.cause}\n시도한 조치: ${consultation.tried}`,
  );
  const [editingSummary, setEditingSummary] = useState(false);
  const [files, setFiles] = useState<string[]>(["첨부 사진 1", "첨부 사진 2"]);
  const [status, setStatus] = useState<"editing" | "saved" | "sent">("editing");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <Panel tone="outline" className="flex-1 items-start">
        <Badge tone="primary">접수됨</Badge>
        <h2 className="text-title-lg text-black">신고서를 보냈어요</h2>
        <p className="text-body-md text-secondary-700">
          요청번호 {consultation.id} · 제작 업체 호출 수신함에 올라갔어요. 엔지니어가 배정되면 알려
          드릴게요.
        </p>
        <ButtonLink href={`/consult/${consultation.id}`} variant="ghost">
          상담 내역으로 돌아가기
        </ButtonLink>
      </Panel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 flex-1">
      <Panel tone="outline" className="gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-label-lg text-black">설비</h2>
          <p className="flex flex-wrap gap-x-3 rounded-lg border-2 border-secondary-100 px-4 py-3 text-body-md">
            <span className="font-semibold text-black">{equipment.name}</span>
            <span className="text-secondary-600">
              {equipment.model} · {equipment.place} · {equipment.serial}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-label-lg text-black">AI 상담 요약</h2>
          <div className="flex flex-col gap-2 rounded-lg border-2 border-primary-100 bg-primary-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Badge tone="primary">자동 입력</Badge>
              <span className="flex-1 text-label-md font-normal text-secondary-600">
                상담 대화에서 가져왔어요
              </span>
              <button
                type="button"
                onClick={() => setEditingSummary((value) => !value)}
                className="cursor-pointer text-body-sm font-semibold text-primary-500 hover:text-primary-600"
              >
                {editingSummary ? "완료" : "수정"}
              </button>
            </div>
            {editingSummary ? (
              <TextArea
                label="AI 상담 요약 수정"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                rows={3}
              />
            ) : (
              <p className="text-body-md whitespace-pre-line text-black">{summary}</p>
            )}
          </div>
        </div>

        <TextArea
          label="증상 자세히"
          required
          rows={4}
          placeholder="예: 오늘 아침 첫 세탁부터 탈수 단계에서 멈춰요."
          hint="언제부터, 어떤 상황에서 생기는지 적어 주세요. 엔지니어가 방문 전에 읽어요."
        />

        <div className="flex flex-col gap-6 md:flex-row md:gap-4">
          <OptionGroup
            legend="설비 상태"
            required
            options={machineStates}
            value={machineState}
            onChange={setMachineState}
          />
          <OptionGroup
            legend="긴급도"
            required
            options={urgencies}
            value={urgency}
            onChange={setUrgency}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-label-lg text-black">사진·영상 첨부</h2>
          <div className="flex flex-wrap gap-3">
            {files.map((file) => (
              <Placeholder key={file} label={file} className="size-24" />
            ))}
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-secondary-300 text-secondary-600 hover:border-secondary-500 has-focus-visible:outline-2 has-focus-visible:outline-primary-500">
              <span className="text-heading-sm font-normal">+</span>
              <span className="text-label-md font-normal">추가</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  const added = Array.from(event.target.files ?? [], (file) => file.name);
                  setFiles((current) => [...current, ...added]);
                }}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="담당자 연락처" type="tel" defaultValue="010-1234-5678" />
          <TextField label="방문 가능 시간" defaultValue="평일 09:00 – 18:00" />
        </div>

        <div className="flex items-center justify-end gap-2">
          {status === "saved" && (
            <p role="status" className="mr-auto text-body-sm text-secondary-600">
              임시 저장했어요.
            </p>
          )}
          <Button variant="ghost" onClick={() => setStatus("saved")}>
            임시 저장
          </Button>
          <Button type="submit">신고서 제출하고 호출</Button>
        </div>
      </Panel>
    </form>
  );
}
