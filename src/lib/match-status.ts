export type MatchStatus = "live" | "upcoming" | "ended";

const NINETY_MIN = 90 * 60 * 1000;

export interface StatusInfo {
  status: MatchStatus;
  /** Minutes until kickoff (negative if past). */
  minutesUntil: number;
  /** Current minute of the match (1-90+) when live. */
  liveMinute: number;
  /** Pretty kickoff time, e.g. "16:00". */
  kickoffLabel: string;
}

export function getMatchStatus(kickoff: string, now: Date = new Date()): StatusInfo {
  const start = new Date(kickoff);
  const end = new Date(start.getTime() + NINETY_MIN);
  const diffMs = start.getTime() - now.getTime();
  const minutesUntil = Math.round(diffMs / 60000);
  const kickoffLabel = start.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (now < start) return { status: "upcoming", minutesUntil, liveMinute: 0, kickoffLabel };
  if (now > end) return { status: "ended", minutesUntil, liveMinute: 90, kickoffLabel };

  const liveMinute = Math.max(
    1,
    Math.min(90, Math.round((now.getTime() - start.getTime()) / 60000)),
  );
  return { status: "live", minutesUntil, liveMinute, kickoffLabel };
}

export function formatCountdown(minutesUntil: number): string {
  if (minutesUntil <= 0) return "Agora";
  if (minutesUntil < 60) return `Em ${minutesUntil}min`;
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;
  return m === 0 ? `Em ${h}h` : `Em ${h}h${m.toString().padStart(2, "0")}`;
}
