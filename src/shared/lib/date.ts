// Mock dates are stored as "YYYY.MM.DD"; screens show shorter forms.

export function formatShortDate(date: string) {
  const [, month, day] = date.split(".");
  return `${month}.${day}`;
}

export function formatMonthDay(date: string) {
  const [, month, day] = date.split(".");
  return `${Number(month)}월 ${Number(day)}일`;
}
