"use client";

import { useState, type FormEvent } from "react";
import { callReasonLabels } from "@/entities/service-call";
import { useMe } from "@/entities/user";
import {
  consultationApi,
  errorMessage,
  fileApi,
  fileUrl,
  requestApi,
  useApi,
  type AiSummary,
  type Attachment,
  type EquipmentState,
  type RequestDetailResponse,
  type RequestDraftResponse,
  type Urgency,
} from "@/shared/api";
import {
  Badge,
  Button,
  ButtonLink,
  LoadState,
  OptionGroup,
  Panel,
  TextArea,
  TextField,
} from "@/shared/ui";

type Props = {
  consultationId: number;
};

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

// The API takes up to five attachments per request.
const MAX_FILES = 5;

export function ReportForm({ consultationId }: Props) {
  const draft = useApi(
    () => consultationApi.requestDraft(consultationId),
    `request-draft:${consultationId}`,
  );

  if (!draft.data) return <LoadState error={draft.error} className="flex-1" />;
  return <ReportFields consultationId={consultationId} draft={draft.data} />;
}

type FieldsProps = {
  consultationId: number;
  draft: RequestDraftResponse;
};

function ReportFields({ consultationId, draft }: FieldsProps) {
  const { data: me } = useMe();
  const [machineState, setMachineState] = useState<EquipmentState>("STOPPED");
  const [urgency, setUrgency] = useState<Urgency>("HIGH");
  const [summary, setSummary] = useState<AiSummary>(draft.aiSummary ?? {});
  const [editingSummary, setEditingSummary] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<RequestDetailResponse>();
  const contact = draft.contact;

  async function upload(selected: File[]) {
    const room = MAX_FILES - files.length;
    if (room <= 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(selected.slice(0, room).map(fileApi.upload));
      setFiles((current) => [...current, ...uploaded]);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const filled = Object.fromEntries(
      Object.entries(summary).filter(([, value]) => value?.trim()),
    ) as AiSummary;
    setPending(true);
    setError("");
    try {
      setSent(
        await requestApi.create({
          consultationId,
          equipmentId: draft.equipmentId,
          aiSummary: Object.keys(filled).length ? filled : undefined,
          symptomDetail: field("symptomDetail"),
          equipmentState: machineState,
          urgency,
          contact: {
            reporterName: field("reporterName"),
            reporterPhone: field("reporterPhone"),
            companyPhone: field("companyPhone"),
          },
          attachmentKeys: files.length ? files.map((file) => file.fileKey) : undefined,
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
          <h2 className="text-label-lg text-black">설비</h2>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border-2 border-secondary-100 px-4 py-3 text-body-md">
            <span className="font-semibold text-black">{draft.equipmentName}</span>
            <span className="text-secondary-600">
              {draft.modelCode} · {draft.modelName}
            </span>
            {draft.callReason && <Badge tone="primary">{callReasonLabels[draft.callReason]}</Badge>}
          </p>
          {draft.suspectedPart && (
            <p className="px-4 text-body-sm text-secondary-600">
              의심 부품: {draft.suspectedPart.name} · {draft.suspectedPart.code}
            </p>
          )}
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
              summaryFields.map(({ key, label, maxLength }) => (
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
              ))
            ) : (
              <dl className="flex flex-col gap-1 text-body-md">
                {summaryFields.map(({ key, label }) => (
                  <div key={key} className="flex">
                    <dt className="w-22 shrink-0 text-secondary-600">{label}</dt>
                    <dd className="text-black">{summary[key] || "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
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
          <h2 className="text-label-lg text-black">
            사진·영상 첨부{" "}
            <span className="text-label-md font-normal text-secondary-600">
              {files.length} / {MAX_FILES}
            </span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {files.map((file) => (
              <div
                key={file.fileKey}
                className="relative size-24 overflow-hidden rounded-lg bg-secondary-100"
              >
                {file.contentType.startsWith("image/") ? (
                  // Uploaded files live on the API's storage, outside next/image's configured hosts.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileUrl(file.url)} alt="첨부 사진" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-label-md text-secondary-700">
                    영상
                  </span>
                )}
                <button
                  type="button"
                  aria-label="첨부 삭제"
                  onClick={() =>
                    setFiles((current) => current.filter((item) => item.fileKey !== file.fileKey))
                  }
                  className="absolute top-1 right-1 cursor-pointer rounded-md bg-white px-1.5 text-label-md text-black"
                >
                  ×
                </button>
              </div>
            ))}
            {files.length < MAX_FILES && (
              <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-secondary-300 text-secondary-600 hover:border-secondary-500 has-focus-visible:outline-2 has-focus-visible:outline-primary-500">
                <span className="text-heading-sm font-normal">+</span>
                <span className="text-label-md font-normal">
                  {uploading ? "올리는 중…" : "추가"}
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  disabled={uploading}
                  className="sr-only"
                  onChange={(event) => {
                    upload(Array.from(event.target.files ?? []));
                    event.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Keyed so the defaults fill in once /api/me arrives. */}
        <div key={me?.userId ?? "loading"} className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="담당자 이름"
            name="reporterName"
            maxLength={50}
            defaultValue={contact?.reporterName || me?.name}
            required
          />
          <TextField
            label="담당자 연락처"
            name="reporterPhone"
            type="tel"
            defaultValue={contact?.reporterPhone || me?.phone}
            required
          />
          <TextField
            label="회사 연락처"
            name="companyPhone"
            type="tel"
            defaultValue={contact?.companyPhone}
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
          <Button type="submit" disabled={pending || uploading}>
            {pending ? "보내는 중…" : "신고서 제출하고 호출"}
          </Button>
        </div>
      </Panel>
    </form>
  );
}
