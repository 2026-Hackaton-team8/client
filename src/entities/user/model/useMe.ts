"use client";

import { meApi, useApi } from "@/shared/api";

// Signed-in user; a 401 here sends the browser to /login.
export function useMe() {
  return useApi(meApi.get, "me");
}
