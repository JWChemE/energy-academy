"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

/**
 * useState that survives remounts, navigation and tab closes by mirroring the
 * value into localStorage. Built for in-progress quiz/capstone answers: a
 * learner who leaves the tab to research a question or use a calculator must
 * come back to exactly where they were.
 *
 * Hydration-safe: the first render always uses `initial` (matching the server
 * HTML); the stored value is applied in an effect straight after mount, and
 * nothing is written back to storage until that restore has happened, so a
 * saved session can't be clobbered by the initial value.
 *
 * `key` may be null to disable persistence entirely (plain useState).
 * `validate` guards against stale/foreign stored shapes — return false and
 * the stored value is discarded.
 */
export function usePersistentState<T>(
  key: string | null,
  initial: () => T,
  validate?: (value: T) => boolean
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(initial);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (key === null) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as { v: number; data: T };
        if (parsed && parsed.v === 1 && (!validate || validate(parsed.data))) {
          setValue(parsed.data);
        }
      }
    } catch {
      // Corrupt or inaccessible storage: carry on with the initial value.
    }
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (key === null || !restored) return;
    try {
      window.localStorage.setItem(key, JSON.stringify({ v: 1, data: value }));
    } catch {
      // Quota/private-mode failures: the in-memory state still works.
    }
  }, [key, value, restored]);

  const reset = useCallback(() => {
    setValue(initial());
    if (key !== null) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, reset];
}

/** Remove every persisted entry under a key prefix (a capstone's whole run). */
export function clearPersistedPrefix(prefix: string) {
  try {
    const doomed: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) doomed.push(k);
    }
    doomed.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
