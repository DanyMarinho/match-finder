import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { ActiveAlert, AlertType } from "@/data/venues";

type Map = Record<string, ActiveAlert[]>;

const RECENT_MS = 3 * 60 * 60 * 1000; // 3h

export function useAlerts(seedAlerts: Map = {}) {
  const [extra, setExtra] = useLocalStorage<Map>("matchmap:alerts:v1", {});

  const cleanRecent = (arr: ActiveAlert[]) =>
    arr.filter((a) => Date.now() - new Date(a.reportedAt).getTime() < RECENT_MS);

  const alertsFor = useCallback(
    (venueId: string): ActiveAlert[] =>
      cleanRecent([...(seedAlerts[venueId] ?? []), ...(extra[venueId] ?? [])]),
    [extra, seedAlerts],
  );

  const report = (venueId: string, type: AlertType) => {
    const newAlert: ActiveAlert = {
      id: `${type}-${Date.now()}`,
      type,
      reportedAt: new Date().toISOString(),
      votes: 1,
    };
    setExtra((prev) => ({
      ...prev,
      [venueId]: [...(prev[venueId] ?? []), newAlert],
    }));
  };

  const confirmAlert = (venueId: string, alertId: string) => {
    setExtra((prev) => {
      const list = prev[venueId] ?? [];
      const exists = list.find((a) => a.id === alertId);
      if (exists) {
        return {
          ...prev,
          [venueId]: list.map((a) =>
            a.id === alertId ? { ...a, votes: a.votes + 1 } : a,
          ),
        };
      }
      // alert came from seed — store a vote-only copy
      return {
        ...prev,
        [venueId]: [
          ...list,
          {
            id: `${alertId}-vote-${Date.now()}`,
            type: "no_tv",
            reportedAt: new Date().toISOString(),
            votes: 1,
          },
        ],
      };
    });
  };

  const aggregated = useMemo(() => {
    const all: Record<string, ActiveAlert[]> = {};
    const ids = new Set([...Object.keys(seedAlerts), ...Object.keys(extra)]);
    ids.forEach((id) => {
      all[id] = alertsFor(id);
    });
    return all;
  }, [alertsFor, extra, seedAlerts]);

  return { alertsFor, report, confirmAlert, aggregated };
}

export const ALERT_LABELS: Record<AlertType, { label: string; emoji: string }> = {
  no_tv: { label: "Sem sinal de TV", emoji: "📵" },
  no_sub: { label: "Sem o pacote do jogo", emoji: "🛰️" },
  closed: { label: "Bar fechado", emoji: "🚪" },
  full: { label: "Lotado", emoji: "🔥" },
};
