import type { Venue } from "@/data/venues";
import { usePoll } from "@/hooks/use-poll";
import { cn } from "@/lib/utils";

export function TorcidaPoll({ venue }: { venue: Venue }) {
  const { tallyFor, myVote, vote } = usePoll();
  const match = venue.matches[0];
  if (!match) return null;
  const tally = tallyFor(venue.id, match.id);
  const total = Math.max(1, tally.home + tally.away);
  const homePct = Math.round((tally.home / total) * 100);
  const awayPct = 100 - homePct;
  const mine = myVote(venue.id, match.id);

  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-elevated/40 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Qual torcida domina hoje?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(["home", "away"] as const).map((side) => {
          const team = side === "home" ? match.home : match.away;
          const pct = side === "home" ? homePct : awayPct;
          const on = mine === side;
          return (
            <button
              key={side}
              onClick={() => vote(venue.id, match.id, side)}
              className={cn(
                "relative overflow-hidden rounded-md border px-3 py-2 text-left transition-all",
                on ? "border-primary" : "border-border hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 -z-10",
                  on ? "bg-primary/25" : "bg-primary/10",
                )}
                style={{ width: `${pct}%` }}
              />
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold">{team}</span>
                <span className="text-xs font-bold text-primary">{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
