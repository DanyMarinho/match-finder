import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { seedRange } from "@/lib/hash";

interface State {
  delta: Record<string, number>;
  confirmed: Record<string, boolean>; // key venueId:date
}

const today = () => new Date().toISOString().slice(0, 10);

export function useLiveConfirmations() {
  const [state, setState] = useLocalStorage<State>("matchmap:liveconfirm:v1", {
    delta: {},
    confirmed: {},
  });

  const dayKey = today();
  const base = (venueId: string) => seedRange(`live:${venueId}:${dayKey}`, 0, 12);

  const countFor = useCallback(
    (venueId: string) => base(venueId) + (state.delta[venueId] ?? 0),
    [state.delta],
  );

  const hasConfirmed = (venueId: string) => !!state.confirmed[`${venueId}:${dayKey}`];

  const confirm = (venueId: string) => {
    const k = `${venueId}:${dayKey}`;
    setState((prev) => {
      const was = !!prev.confirmed[k];
      return {
        delta: {
          ...prev.delta,
          [venueId]: (prev.delta[venueId] ?? 0) + (was ? -1 : 1),
        },
        confirmed: { ...prev.confirmed, [k]: !was },
      };
    });
  };

  return { countFor, hasConfirmed, confirm };
}
