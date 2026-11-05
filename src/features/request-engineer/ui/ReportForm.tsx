"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMe } from "@/entities/user";
import {
  equipmentApi,
  errorMessage,
  requestApi,
  useApi,
  type AiSummary,
  type EquipmentState,
  type RequestDetailResponse,
  type Urgency,
} from "@/shared/api";
import {
  Badge,
  Button,
  ButtonLink,
  LoadState,
  OptionGroup,
  Panel,
  Placeholder,
  Select,
  TextArea,
  TextField,
} from "@/shared/ui";

const machineStates: { value: EquipmentState; label: string }[] = [
  { value: "STOPPED", label: "완전히 멈춤" },
  { value: "PARTIAL", label: "일부만 가동" },
  { value: "NORMAL", label: "정상 가동" },
];

const urgencies: { value: Urgency; label: string; description: string }[] = [
  { value: "HIGH", label: "긴급", description: "생산 중단" },
  { value: "MEDIUM", label: "보통", description: "며칠 내" },
  { value: "LOW", label: "낮음", description: "여유 있음" },
];

const summaryFields: { key: keyof AiSummary; label: string; maxLength: number }[] = [
  { key: "symptom", label: "증상", maxLength: 500 },
  { key: "cause", label: "좁힌 원인", maxLength: 500 },
  { key: "triedAction", label: "시도한 조치", maxLength: 1000 },
];

export function ReportForm() {
  const { data: me } = useMe();
  const equipments = useApi(equipmentApi.list, "equipments");
  const [equipmentId, setEquipmentId] = useState(useSearchParams()?.get("equipment") ?? "");
  const [machineState, setMachineState] = useState<EquipmentState>("STOPPED");
  const [urgency, setUrgency] = useState<Urgency>("HIGH");
  // AI consultation isn't wired to the API yet, so the reporter fills the summary in.
  const [summary, setSummary] = useState<AiSummary>({});
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<RequestDetailResponse>();

  // An id from the URL that isn't one of my equipments falls back to the first one.
  const equipment =
    equipments.data?.find((item) => String(item.id) === equipmentId) ?? equipments.data?.[0];
  const selectedId = equipment ? String(equipment.id) : "";
  const filledSummary = Object.fromEntries(
    Object.entries(summary).filter(([, value]) => value?.trim()),
  ) as AiSummary;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!equipment) return;
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    setPending(true);
    setError("");
    try {
      setSent(
        await requestApi.create({
          equipmentId: equipment.id,
          aiSummary: Object.keys(filledSummary).length ? filledSummary : undefined,
          symptomDetail: field("symptomDetail"),
          equipmentState: machineState,
          urgency,
          contact: {
            reporterName: field("reporterName"),
            reporterPhone: field("reporterPhone"),
            companyPhone: field("companyPhone"),
          },
        }),
      );
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
  }

  if (sent) {
    return (
      <Panel tone="outline" className="flex-1 items-start">
        <Badge tone="primary">접수됨</Badge>
        <h2 className="text-title-lg text-black">신고서를 보냈어요</h2>
        <p className="text-body-md text-secondary-700">
          요청번호 {sent.requestNo} · 제작 업체 호출 수신함에 올라갔어요. 엔지니어가 배정되면 알려
          드릴게요.
        </p>
        <ButtonLink href={`/requests/${sent.id}`} variant="ghost">
          진행 상황 보기
        </ButtonLink>
      </Panel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 flex-1">
      <Panel tone="outline" className="gap-6">
        <div className="flex flex-col gap-2">
          {equipments.loading || equipments.error ? (
            <LoadState error={equipments.error} className="py-3" />
          ) : equipments.data?.length === 0 ? (
            <p className="text-body-md text-secondary-600">
              먼저 설비를 등록해 주세요.{" "}
              <ButtonLink href="/equipment/new" variant="ghost" size="sm">
                설비 등록
              </ButtonLink>
            </p>
          ) : (
            <>
              <Select
                label="설비"
                options={(equipments.data ?? []).map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
                value={selectedId}
                onChange={(event) => setEquipmentId(event.target.value)}
              />
              {equipment && (
                <p className="px-4 text-body-sm text-secondary-600">
                  {equipment.model.code} · {equipment.location}
                  {equipment.serialNumber && ` · ${equipment.serialNumber}`}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-label-lg text-black">AI 상담 요약</h2>
          <div className="flex flex-col gap-3 rounded-lg border-2 border-primary-100 bg-primary-50 px-4 py-3">
            <p className="text-label-md font-normal text-secondary-600">
              상담에서 확인한 내용을 적어 주세요. 비워 두어도 돼요.
            </p>
            {summaryFields.map(({ key, label, maxLength }) => (
              <TextArea
                key={key}
                label={label}
                rows={2}
                maxLength={maxLength}
                value={summary[key] ?? ""}
                onChange={(event) =>
                  setSummary((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            ))}
          </div>
        </div>

        <TextArea
          label="증상 자세히"
          name="symptomDetail"
          required
          rows={4}
          maxLength={2000}
          placeholder="예: 오늘 아침 첫 세탁부터 탈수 단계에서 멈춰요."
          hint="언제부터, 어떤 상황에서 생기는지 적어 주세요. 엔지니어가 방문 전에 읽어요."
        />

        <div className="flex flex-col gap-6 md:flex-row md:gap-4">
          <OptionGroup
            legend="설비 상태"
            required
            options={machineStates}
            value={machineState}
            onChange={(value) => setMachineState(value as EquipmentState)}
          />
          <OptionGroup
            legend="긴급도"
            required
            options={urgencies}
            value={urgency}
            onChange={(value) => setUrgency(value as Urgency)}
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
          <p className="text-label-md font-normal text-secondary-600">
            첨부 업로드는 아직 지원하지 않아 신고서에는 포함되지 않아요.
          </p>
        </div>

        {/* Keyed on the user so the defaults fill in once /api/me arrives. */}
        <div key={me?.userId ?? "loading"} className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="담당자 이름"
            name="reporterName"
            maxLength={50}
            defaultValue={me?.name}
            required
          />
          <TextField
            label="담당자 연락처"
            name="reporterPhone"
            type="tel"
            defaultValue={me?.phone}
            required
          />
          <TextField
            label="회사 연락처"
            name="companyPhone"
            type="tel"
            placeholder="02-000-0000"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          {error && (
            <p role="alert" className="mr-auto text-body-sm text-primary-600">
              {error}
            </p>
          )}
          <Button type="submit" disabled={!equipment || pending}>
            {pending ? "보내는 중…" : "신고서 제출하고 호출"}
          </Button>
        </div>
      </Panel>
    </form>
  );
}
