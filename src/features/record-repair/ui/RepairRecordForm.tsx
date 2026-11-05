"use client";

import { useState, type FormEvent } from "react";
import { errorMessage, makerApi, type Difficulty, type PartResponse } from "@/shared/api";
import {
  Badge,
  Button,
  ButtonLink,
  OptionGroup,
  Panel,
  Select,
  TextArea,
  UnityViewer,
} from "@/shared/ui";

type Props = {
  requestId: number;
  model: string;
  parts: PartResponse[];
  equipmentCode?: string;
};

const causes = ["이물질 걸림", "마모", "체결 불량", "전기적 결함", "기타"].map((label) => ({
  value: label,
  label,
}));

const levels: { value: Difficulty; label: string }[] = [
  { value: "SELF", label: "이용 기업이 직접 시도 가능" },
  { value: "ENGINEER", label: "엔지니어 작업 필요" },
];

export function RepairRecordForm({ requestId, model, parts, equipmentCode }: Props) {
  const [partId, setPartId] = useState(parts[0]?.id);
  const [level, setLevel] = useState<Difficulty>("ENGINEER");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const part = parts.find((item) => item.id === partId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!part) return;
    const data = new FormData(event.currentTarget);
    const detail = String(data.get("causeDetail") ?? "").trim();
    setPending(true);
    setError("");
    try {
      await makerApi.recordRepair(requestId, {
        partId: part.id,
        cause: detail ? `${data.get("cause")} · ${detail}` : String(data.get("cause")),
        solution: String(data.get("solution") ?? "").trim(),
        difficulty: level,
      });
      setSaved(true);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <Panel
        tone="plain"
        title="고장 부품 선택"
        titleAddon={
          <span className="text-label-md font-normal text-secondary-600">
            3D에서 클릭하거나 목록에서 선택
          </span>
        }
        className="shrink-0 gap-4 lg:w-110"
      >
        <UnityViewer
          label={`${model} 3D 모델`}
          equipmentCode={equipmentCode}
          // Unity highlights by mesh name ("ROBOT-001:BASE"); fall back to the part code.
          partCode={part?.meshName ?? part?.code}
          className="h-90"
        />
        <ul aria-label="부품 목록" className="flex flex-col gap-1">
          {parts.length === 0 && (
            <li className="px-3 py-2.5 text-body-md text-secondary-600">
              이 모델에 등록된 부품이 없어요.
            </li>
          )}
          {parts.map((item) => {
            const selected = item.id === partId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPartId(item.id)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                    selected ? "bg-primary-50" : "hover:bg-secondary-50"
                  }`}
                >
                  <span
                    className={`w-28 shrink-0 truncate text-label-md ${selected ? "text-primary-500" : "text-secondary-600"}`}
                  >
                    {item.code}
                  </span>
                  <span className={`text-body-md text-black ${selected ? "font-semibold" : ""}`}>
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <form onSubmit={handleSubmit} className="min-w-0 flex-1">
        <Panel tone="plain" className="gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-label-lg text-black">부품 ID</h2>
            <p className="flex gap-2 px-4 py-1 text-body-md">
              <span className="font-semibold text-primary-500">{part?.code}</span>
              <span className="text-black">{part?.name}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Select label="고장 원인" name="cause" options={causes} />
            <TextArea
              label="고장 원인 자세히"
              name="causeDetail"
              hideLabel
              rows={2}
              maxLength={1900}
              placeholder="예: 임펠러에 섬유 뭉치가 감겨 회전은 되지만 배수가 안 됨"
            />
          </div>
          <TextArea
            label="해결 방법"
            name="solution"
            rows={4}
            maxLength={4000}
            required
            placeholder="예: 펌프 커버 분리 후 임펠러 이물질 제거, 재조립 후 배수 테스트 정상"
          />
          <OptionGroup
            legend="조치 난이도"
            options={levels}
            value={level}
            onChange={(value) => setLevel(value as Difficulty)}
            radio
          />
          <p className="px-4 text-body-sm text-secondary-700">
            저장하면 이 설비의 이력과 {model} 모델 이력에 함께 기록되고, 다음 AI 상담의 근거로
            쓰여요.
          </p>
          {saved ? (
            <div role="status" className="flex items-center justify-end gap-3">
              <Badge tone="primary">수리 완료</Badge>
              <span className="text-label-lg text-black">수리 이력을 저장했어요.</span>
              <ButtonLink href="/maker/records" variant="ghost">
                수리 이력 보기
              </ButtonLink>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              {error && (
                <p role="alert" className="mr-auto text-body-sm text-primary-600">
                  {error}
                </p>
              )}
              <ButtonLink href={`/maker/calls/${requestId}`} variant="ghost">
                취소
              </ButtonLink>
              <Button type="submit" disabled={!part || pending}>
                {pending ? "저장하는 중…" : "저장하고 수리 완료"}
              </Button>
            </div>
          )}
        </Panel>
      </form>
    </div>
  );
}
