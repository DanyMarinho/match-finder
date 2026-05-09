import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { seedRange } from "@/lib/hash";

interface State {
  /** Extra confirmed by users this session (added to seed). */
  delta: Record<string, number>;
  /** Whether current user marked attending today. */
  attending: Record<string, boolean>;
}

const today = () => new Date().toISOString().slice(0, 10);

export function useAttendance() {
  const [state, setState] = useLocalStorage<State>("matchmap:attendance:v1", {
    delta: {},
    attending: {},
  });

  const dayKey = today();

  const baseFor = (venueId: string) => seedRange(`${venueId}:${dayKey}`, 8, 36);

  const countFor = useCallback(
    (venueId: string) => baseFor(venueId) + (state.delta[venueId] ?? 0),
    [state.delta],
  );

  const isAttending = (venueId: string) => !!state.attending[`${venueId}:${dayKey}`];

  const toggle = (venueId: string) => {
    const k = `${venueId}:${dayKey}`;
    setState((prev) => {
      const wasOn = !!prev.attending[k];
      return {
        delta: {
          ...prev.delta,
          [venueId]: (prev.delta[venueId] ?? 0) + (wasOn ? -1 : 1),
        },
        attending: { ...prev.attending, [k]: !wasOn },
      };
    });
  };

  return { countFor, isAttending, toggle };
}
