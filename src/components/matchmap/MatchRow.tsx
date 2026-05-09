import type { Match, Venue } from "@/data/venues";
import { formatCountdown, getMatchStatus } from "@/lib/match-status";
import { LiveBadge } from "./LiveBadge";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  match: Match;
  venue: Venue;
  showCoverage?: boolean;
}

export function MatchRow({ match, venue, showCoverage = true }: Props) {
  const info = getMatchStatus(match.kickoff);
  const operational = venue.operationalStatus === "open";
  const covered = match.requiredPackage
    ? venue.broadcastPackages.includes(match.requiredPackage)
    : true;

  return (
    <div className="rounded-lg border border-border bg-surface-elevated/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {match.competition}
          </p>
          <p className="mt-0.5 truncate font-semibold">
            {match.home} <span className="text-muted-foreground">×</span> {match.away}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {operational && info.status === "live" ? (
            <LiveBadge label={`AO VIVO • ${info.liveMinute}'`} />
          ) : info.status === "ended" ? (
            <LiveBadge label="Encerrado" tone="muted" />
          ) : (
            <span className="text-xs font-semibold text-foreground">
              {info.kickoffLabel}
              <span className="ml-1 text-muted-foreground">
                · {formatCountdown(info.minutesUntil)}
              </span>
            </span>
          )}
        </div>
      </div>
      {showCoverage && match.requiredPackage && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px]",
            covered
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-amber-500/15 text-amber-300",
          )}
        >
          {covered ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <AlertTriangle className="h-3 w-3" />
          )}
          {covered
            ? `Transmissão garantida (${match.requiredPackage})`
            : `Pacote ${match.requiredPackage} não confirmado`}
        </div>
      )}
    </div>
  );
}
