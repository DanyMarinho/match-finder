import { useCallback, useEffect, useState } from "react";
import { seedRange } from "@/lib/hash";

const today = () => new Date().toISOString().split("T")[0];
const storageKey = (venueId: string) =>
  `matchmap_confirmed_${venueId}_${today()}`;

export function useLiveConfirmations() {
  // Map of venueId -> +1 delta (only ever 0 or 1 per day per device)
  const [delta, setDelta] = useState<Record<string, number>>({});
  // Map of venueId -> already confirmed today
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  // Hydrate confirmed flags from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next: Record<string, boolean> = {};
    const nextDelta: Record<string, number> = {};
    const prefix = `matchmap_confirmed_`;
    const day = today();
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(prefix) || !k.endsWith(`_${day}`)) continue;
      const venueId = k.slice(prefix.length, k.length - day.length - 1);
      next[venueId] = true;
      nextDelta[venueId] = 1;
    }
    setConfirmed(next);
    setDelta(nextDelta);
  }, []);

  const dayKey = today();
  const base = useCallback(
    (venueId: string) => seedRange(`live:${venueId}:${dayKey}`, 0, 12),
    [dayKey],
  );

  const countFor = useCallback(
    (venueId: string) => base(venueId) + (delta[venueId] ?? 0),
    [delta, base],
  );

  const hasConfirmed = useCallback(
    (venueId: string) => !!confirmed[venueId],
    [confirmed],
  );

  const confirm = useCallback((venueId: string): boolean => {
    if (typeof window === "undefined") return false;
    const key = storageKey(venueId);
    if (window.localStorage.getItem(key)) return false;
    window.localStorage.setItem(key, "true");
    setConfirmed((p) => ({ ...p, [venueId]: true }));
    setDelta((p) => ({ ...p, [venueId]: (p[venueId] ?? 0) + 1 }));
    return true;
  }, []);

  return { countFor, hasConfirmed, confirm };
}
