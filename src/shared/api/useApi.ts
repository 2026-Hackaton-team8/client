"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";

type Result<T> = { tag: string; data?: T; error?: unknown };

// Loads data on the client (tokens only exist in the browser) and reloads when `key` changes.
// Earlier data stays visible while a reload is in flight.
export function useApi<T>(load: () => Promise<T>, key: string) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result<T>>();
  const run = useEffectEvent(load);
  const tag = `${key}#${version}`;

  useEffect(() => {
    let active = true;
    run().then(
      (data) => active && setResult({ tag, data }),
      (error: unknown) => active && setResult({ tag, error }),
    );
    return () => {
      active = false;
    };
  }, [tag]);

  const settled = result?.tag === tag;
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return {
    data: result?.data,
    error: settled ? result.error : undefined,
    loading: !settled,
    reload,
  };
}
