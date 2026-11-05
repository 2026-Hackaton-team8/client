"use client";

import { useState, type FormEvent } from "react";
import type { ChatMessage, Consultation } from "@/entities/consultation";
import { Badge, Button, ButtonLink, TextField } from "@/shared/ui";

type Props = {
  consultation: Consultation;
};

export function ConsultChat({ consultation }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(consultation.messages);
  const [draft, setDraft] = useState("");
  const [resolved, setResolved] = useState(consultation.status === "resolved");

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: `local-${current.length}`, from: "user", text }]);
    setDraft("");
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
            질문 {consultation.questions} / 최대 {consultation.maxQuestions}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-body-sm text-secondary-600">원인 후보</span>
          {consultation.candidates.map((candidate) => (
            <Badge
              key={candidate.name}
              tone={candidate.ruledOut ? "neutral" : "accent"}
              strike={candidate.ruledOut}
            >
              {candidate.name}
            </Badge>
          ))}
        </div>
      </header>

      <div aria-live="polite" className="flex flex-1 flex-col gap-3 bg-primary-50 px-6 py-5">
        {messages.map((message) => (
          <p
            key={message.id}
            className={`max-w-4/5 rounded-xl px-3.5 py-2.5 text-body-md ${
              message.from === "user"
                ? "self-end bg-primary-500 text-white"
                : "self-start bg-white text-black"
            }`}
          >
            <span className="sr-only">{message.from === "user" ? "나: " : "AI: "}</span>
            {message.text}
          </p>
        ))}

        <div className="flex flex-col gap-2.5 rounded-lg border-2 border-primary-300 bg-white p-4">
          <h3 className="text-title-md text-black">{consultation.solution.title}</h3>
          <ol className="flex list-inside list-decimal flex-col gap-1 text-body-md text-black">
            {consultation.solution.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-label-md font-normal text-secondary-600">
            {consultation.solution.source}
          </p>
          {resolved ? (
            <p
              role="status"
              className="rounded-lg bg-secondary-50 px-4 py-3 text-label-lg text-black"
            >
              해결됐어요. 이 상담은 해결됨으로 기록돼요.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button className="flex-1" onClick={() => setResolved(true)}>
                해결됐어요
              </Button>
              <ButtonLink
                href={`/consult/${consultation.id}/report`}
                variant="ghost"
                className="flex-1"
              >
                해결 안 됨 · 담당자 호출
              </ButtonLink>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 border-t border-secondary-100 bg-primary-50 px-4 py-3"
      >
        <TextField
          label="메시지"
          hideLabel
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="증상을 입력하세요"
        />
        <Button type="submit" className="h-12">
          보내기
        </Button>
      </form>
    </section>
  );
}
