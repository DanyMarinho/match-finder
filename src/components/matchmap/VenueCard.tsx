import { motion } from "framer-motion";
import { Star, MapPin, Tv, Flame, ShieldCheck, CheckCheck, Sparkles } from "lucide-react";
import { AMENITY_META, type Venue } from "@/data/venues";
import { cn } from "@/lib/utils";
import { getMatchStatus } from "@/lib/match-status";
import { LiveBadge } from "./LiveBadge";
import { StatusOverlay } from "./StatusOverlay";
import { formatVerified } from "@/lib/format-verified";
import { formatKm } from "@/lib/geo";

interface Props {
  venue: Venue;
  active: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
  attendance: number;
  liveConfirmations: number;
  alertsCount: number;
  distanceKm?: number | null;
}

export function VenueCard({
  venue,
  active,
  onClick,
  onHover,
  attendance,
  liveConfirmations,
  alertsCount,
  distanceKm,
}: Props) {
  const operational = venue.operationalStatus === "open";
  const liveMatch = operational
    ? venue.matches.find((m) => getMatchStatus(m.kickoff).status === "live")
    : undefined;
  const nextMatch =
    venue.matches.find((m) => {
      const s = getMatchStatus(m.kickoff);
      return s.status === "upcoming" || s.status === "live";
    }) ?? venue.matches[0];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      onMouseEnter={() => onHover(venue.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "group block w-full overflow-hidden rounded-xl border bg-card text-left transition-colors",
        active
          ? "border-primary shadow-[var(--shadow-glow)]"
          : "border-border hover:border-highlight/60",
        !operational && "opacity-60",
        venue.suggested && "opacity-70",
      )}
    >
      <StatusOverlay status={venue.operationalStatus} />
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-highlight text-highlight" />
          {venue.rating > 0 ? venue.rating.toFixed(1) : "—"}
        </div>
        {venue.suggested && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-slate-900/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur">
            <Sparkles className="h-3 w-3" /> Sugerido pela Comunidade (Em Análise)
          </div>
        )}
        {alertsCount > 0 && !venue.suggested && (
          <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-amber-950">
            ⚠ {alertsCount} alerta{alertsCount > 1 ? "s" : ""}
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold leading-tight">{venue.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {venue.neighborhood}
              {distanceKm != null && (
                <span className="ml-1 text-primary">· {formatKm(distanceKm)}</span>
              )}
            </p>
          </div>
        </div>

        {nextMatch && operational && (
          <div className="flex items-center justify-between gap-2 rounded-md bg-highlight/10 px-2 py-1 text-xs">
            <div className="flex min-w-0 items-center gap-1.5 text-highlight">
              <Tv className="h-3 w-3 shrink-0" />
              <span className="truncate font-medium">
                {nextMatch.home} × {nextMatch.away}
              </span>
            </div>
            {liveMatch ? (
              <LiveBadge
                label={`AO VIVO ${getMatchStatus(liveMatch.kickoff).liveMinute}'`}
                className="shrink-0"
              />
            ) : (
              <span className="shrink-0 text-[11px] font-bold text-foreground">
                {getMatchStatus(nextMatch.kickoff).kickoffLabel}
              </span>
            )}
          </div>
        )}

        {venue.matches.length > 1 && operational && (
          <p className="text-[11px] text-muted-foreground">
            +{venue.matches.length - 1} outro{venue.matches.length > 2 ? "s" : ""} jogo
            {venue.matches.length > 2 ? "s" : ""} hoje
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {venue.amenities.map((a) => (
            <span
              key={a}
              title={a}
              className="rounded-full bg-surface-elevated px-1.5 py-0.5 text-[11px]"
            >
              {AMENITY_META[a].emoji}
            </span>
          ))}
          {venue.coupon && (
            <span className="rounded-full bg-highlight/15 px-1.5 py-0.5 text-[11px] font-semibold text-highlight">
              🎟 {venue.coupon.label.split(" ").slice(0, 3).join(" ")}…
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-muted-foreground">
          {!venue.suggested && (
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Verificado {formatVerified(venue.lastVerified)}
            </span>
          )}
          {attendance > 0 && (
            <span className="inline-flex items-center gap-1 text-highlight">
              <Flame className="h-3 w-3" /> {attendance} confirmados
            </span>
          )}
          {liveConfirmations > 0 && (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCheck className="h-3 w-3" /> Sinal por {liveConfirmations}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
