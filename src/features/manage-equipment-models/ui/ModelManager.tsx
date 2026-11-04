"use client";

import { useState, type FormEvent } from "react";
import type { EquipmentModel } from "@/entities/equipment-model";
import { Button, PageHeading, TextField } from "@/shared/ui";

type Props = {
  initialModels: EquipmentModel[];
};

type FormState = Pick<EquipmentModel, "name" | "code" | "file">;

const emptyForm: FormState = { name: "", code: "", file: "" };
const today = "2026.11.05";

export function ModelManager({ initialModels }: Props) {
  const [models, setModels] = useState(initialModels);
  const [form, setForm] = useState<FormState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const setField = (key: keyof FormState, value: string) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const openEdit = (model: EquipmentModel) => {
    setEditingId(model.id);
    setForm({ name: model.name, code: model.code, file: model.file });
  };

  const close = () => {
    setForm(null);
    setEditingId(null);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !form.name.trim() || !form.code.trim()) return;
    setModels((prev) =>
      editingId
        ? prev.map((m) => (m.id === editingId ? { ...m, ...form, updatedAt: today } : m))
        : [{ id: `m${Date.now()}`, ...form, parts: 0, installs: 0, updatedAt: today }, ...prev],
    );
    close();
  };

  const remove = (id: string) => setModels((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="모델링 리스트"
        description="설비 모델과 3D 모델 파일을 관리하세요"
        action={
          <Button variant="soft" size="lg" onClick={openAdd}>
            모델 추가
          </Button>
        }
      />

      {form && (
        <form onSubmit={save} className="flex flex-col gap-6 rounded-lg bg-secondary-50 p-6">
          <h2 className="text-title-lg text-black">{editingId ? "모델 수정" : "새 모델"}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <TextField
              label="모델명"
              placeholder="예: 산업용 세탁기"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
            />
            <TextField
              label="모델 코드"
              placeholder="예: WN-20"
              value={form.code}
              onChange={(event) => setField("code", event.target.value)}
            />
            <TextField
              label="3D 모델 파일"
              placeholder="model.glb"
              hint=".glb 파일, 최대 50MB"
              value={form.file}
              onChange={(event) => setField("file", event.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="px-5" onClick={close}>
              취소
            </Button>
            <Button
              type="submit"
              className="px-5"
              disabled={!form.name.trim() || !form.code.trim()}
            >
              저장
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg bg-secondary-50">
        <table className="w-full min-w-3xl border-collapse text-left">
          <thead>
            <tr className="text-label-lg text-secondary-600">
              <th scope="col" className="px-6 py-5">
                모델
              </th>
              <th scope="col" className="px-6 py-5">
                모델 코드
              </th>
              <th scope="col" className="px-6 py-5">
                3D 모델 파일
              </th>
              <th scope="col" className="px-6 py-5">
                등록 파트
              </th>
              <th scope="col" className="px-6 py-5">
                설치 대수
              </th>
              <th scope="col" className="px-6 py-5">
                수정일
              </th>
              <th scope="col" className="px-6 py-5">
                <span className="sr-only">작업</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {models.map((model) => (
              <tr key={model.id} className="border-t-2 border-secondary-100 text-body-md">
                <td className="px-6 py-5 text-title-md text-black">{model.name}</td>
                <td className="px-6 py-5 font-mono text-black">{model.code}</td>
                <td className="px-6 py-5 font-mono text-secondary-700">{model.file || "—"}</td>
                <td className="px-6 py-5 text-black">{model.parts}개</td>
                <td className="px-6 py-5 text-black">{model.installs}대</td>
                <td className="px-6 py-5 text-secondary-600">{model.updatedAt}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`${model.name} 수정`}
                      onClick={() => openEdit(model)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label={`${model.name} 삭제`}
                      onClick={() => remove(model.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-body-md text-secondary-600">
                  등록된 모델이 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
