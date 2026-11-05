// Mock dates are stored as "YYYY.MM.DD"; screens show shorter forms.

export function formatShortDate(date: string) {
  const [, month, day] = date.split(".");
  return `${month}.${day}`;
}

export function formatMonthDay(date: string) {
  const [, month, day] = date.split(".");
  return `${Number(month)}월 ${Number(day)}일`;
}

// The API sends ISO strings ("2026-11-05" or "2026-11-05T14:00:00"); convert to the mock form.
export function toDotDate(iso: string) {
  return iso.slice(0, 10).replaceAll("-", ".");
}

const pad = (value: number) => String(value).padStart(2, "0");

// "오늘 10:42", "어제 17:30", or "2026.11.03 09:15".
export function formatDateTime(iso: string, now = new Date()) {
  const date = new Date(iso);
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const days = Math.round(
    (new Date(now.toDateString()).getTime() - new Date(date.toDateString()).getTime()) / 86_400_000,
  );
  if (days === 0) return `오늘 ${time}`;
  if (days === 1) return `어제 ${time}`;
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${time}`;
}

// Value for <input type="datetime-local">, in local time.
export function toLocalInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
