import type { LoginResponse, Role } from "./types";

// Tokens live in the browser: localStorage when "로그인 상태 유지" is on, sessionStorage otherwise.

export type Session = LoginResponse;

const KEY = "waterfork.session";

function stores(): Storage[] {
  return typeof window === "undefined" ? [] : [window.localStorage, window.sessionStorage];
}

export function getSession(): Session | null {
  for (const store of stores()) {
    const raw = store.getItem(KEY);
    if (raw) return JSON.parse(raw) as Session;
  }
  return null;
}

export function saveSession(session: Session, remember = true) {
  clearSession();
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem(KEY, JSON.stringify(session));
}

// Token refreshes and role changes keep the session in whichever storage it already lives.
export function updateSession(patch: Partial<Session>) {
  for (const store of stores()) {
    const raw = store.getItem(KEY);
    if (raw) store.setItem(KEY, JSON.stringify({ ...JSON.parse(raw), ...patch }));
  }
}

export function clearSession() {
  for (const store of stores()) store.removeItem(KEY);
}

// WORKER works at a user company (사용 업체), STAFF at a maker (제작 업체).
// PENDING hasn't picked a company yet.
export function homeForRole(role: Role) {
  if (role === "WORKER") return "/";
  if (role === "STAFF") return "/maker/calls";
  return "/onboarding";
}
