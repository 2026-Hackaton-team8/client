"use client";

import { useState, type FormEvent } from "react";
import { callReasonLabels } from "@/entities/service-call";
import {
  consultationApi,
  errorMessage,
  type ConsultationDetailResponse,
  type MessageResponse,
} from "@/shared/api";
import { Badge, Button, ButtonLink, TextField } from "@/shared/ui";

type Props = {
  consultation: ConsultationDetailResponse;
  onChange: (consultation: ConsultationDetailResponse) => void;
};

export function ConsultChat({ consultation, onChange }: Props) {
  const [draft, setDraft] = useState("");
  // The answer being sent, shown in the thread until the AI's reply comes back.
  const [sending, setSending] = useState("");
  const [error, setError] = useState("");
  const { messages } = consultation;
  const last = messages.at(-1);
  const candidates = messages.findLast((message) => message.payload?.candidates?.length)?.payload
    ?.candidates;
  const reportHref = `/consult/${consultation.id}/report`;

  async function send(content: string) {
    const text = content.trim();
    if (!text || sending) return;
    setSending(text);
    setDraft("");
    setError("");
    try {
      onChange(await consultationApi.answer(consultation.id, text));
    } catch (caught) {
      setError(errorMessage(caught));
      setDraft(text);
    } finally {
      setSending("");
    }
  }

  async function resolve() {
    setError("");
    try {
      onChange(await consultationApi.resolve(consultation.id));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  return (
    <section
      aria-label="AI 상담"
      className="flex shrink-0 flex-col overflow-hidden rounded-lg lg:w-110"
    >
      <header className="flex flex-col gap-2.5 border-b border-secondary-100 bg-white px-6 py-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-title-lg text-black">AI 상담</h2>
          <span className="text-label-md font-normal text-secondary-600">
            질문 {consultation.questionCount} / 최대 {consultation.maxQuestions}
          </span>
        </div>
        {!!candidates?.length && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-body-sm text-secondary-600">원인 후보</span>
            {candidates.map((candidate) => (
              <Badge key={candidate.cause} tone="accent">
                {candidate.cause}
                {candidate.confidence !== undefined &&
                  ` ${Math.round(candidate.confidence * 100)}%`}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div aria-live="polite" className="flex flex-1 flex-col gap-3 bg-primary-50 px-6 py-5">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isLast={message === last}
            consultation={consultation}
            reportHref={reportHref}
            onOption={send}
            onResolve={resolve}
          />
        ))}
        {sending && (
          <>
            <p className="max-w-4/5 self-end rounded-xl bg-primary-500 px-3.5 py-2.5 text-body-md text-white">
              <span className="sr-only">나: </span>
              {sending}
            </p>
            <p role="status" className="self-start text-body-sm text-secondary-600">
              AI가 답을 정리하고 있어요…
            </p>
          </>
        )}
        {consultation.status === "RESOLVED" && (
          <p role="status" className="rounded-lg bg-white px-4 py-3 text-label-lg text-black">
            해결됐어요. 이 상담은 해결됨으로 기록돼요.
          </p>
        )}
        {consultation.requestId && (
          <p className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-4 py-3 text-label-lg text-black">
            담당자를 호출했어요.
            <ButtonLink href={`/requests/${consultation.requestId}`} size="sm" variant="ghost">
              진행 상황 보기
            </ButtonLink>
          </p>
        )}
        {error && (
          <p role="alert" className="text-body-sm text-primary-600">
            {error}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 border-t border-secondary-100 bg-primary-50 px-4 py-3"
      >
        <TextField
          label="메시지"
          hideLabel
          value={draft}
          maxLength={1000}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!consultation.canAnswer || !!sending}
          placeholder={consultation.canAnswer ? "답변을 입력하세요" : "상담이 끝났어요"}
        />
        <Button
          type="submit"
          className="h-12"
          disabled={!consultation.canAnswer || !!sending || !draft.trim()}
        >
          보내기
        </Button>
      </form>
    </section>
  );
}

type MessageProps = {
  message: MessageResponse;
  isLast: boolean;
  consultation: ConsultationDetailResponse;
  reportHref: string;
  onOption: (option: string) => void;
  onResolve: () => void;
};

function Message({ message, isLast, consultation, reportHref, onOption, onResolve }: MessageProps) {
  const { payload } = message;
  // Calling an engineer is offered until a request has been filed.
  const canCall = !consultation.requestId && consultation.status !== "RESOLVED";

  if (message.sender === "AI" && message.type === "SOLUTION") {
    return (
      <div className="flex flex-col gap-2.5 rounded-lg border-2 border-primary-300 bg-white p-4">
        <h3 className="text-title-md text-black">{message.content}</h3>
        {!!payload?.steps?.length && (
          <ol className="flex list-inside list-decimal flex-col gap-1 text-body-md text-black">
            {payload.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
        {!!payload?.cautions?.length && (
          <ul className="flex flex-col gap-1 text-body-sm text-secondary-700">
            {payload.cautions.map((caution) => (
              <li key={caution}>주의: {caution}</li>
            ))}
          </ul>
        )}
        {isLast && canCall && (
          <div className="flex flex-wrap gap-2">
            {consultation.canResolve && (
              <Button className="flex-1" onClick={onResolve}>
                해결됐어요
              </Button>
            )}
            <ButtonLink href={reportHref} variant="ghost" className="flex-1">
              해결 안 됨 · 담당자 호출
            </ButtonLink>
          </div>
        )}
      </div>
    );
  }

  if (message.sender === "AI" && message.type === "ESCALATE") {
    return (
      <div className="flex flex-col gap-2.5 rounded-lg border-2 border-primary-300 bg-white p-4">
        {payload?.reason && <Badge tone="primary">{callReasonLabels[payload.reason]}</Badge>}
        <p className="text-body-md text-black">{message.content}</p>
        {canCall && (
          <ButtonLink href={reportHref} block>
            담당자 호출 신고서 작성
          </ButtonLink>
        )}
      </div>
    );
  }

  const fromUser = message.sender === "USER";
  return (
    <div className={`flex max-w-4/5 flex-col gap-2 ${fromUser ? "self-end" : "self-start"}`}>
      <p
        className={`rounded-xl px-3.5 py-2.5 text-body-md whitespace-pre-line ${
          fromUser ? "bg-primary-500 text-white" : "bg-white text-black"
        }`}
      >
        <span className="sr-only">{fromUser ? "나: " : "AI: "}</span>
        {message.content}
      </p>
      {isLast && consultation.canAnswer && !!payload?.options?.length && (
        <div className="flex flex-wrap gap-1.5">
          {payload.options.map((option) => (
            <Button key={option} size="sm" variant="soft" onClick={() => onOption(option)}>
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
