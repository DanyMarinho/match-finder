import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Ticket,
  Navigation,
  Car,
  ShieldCheck,
  Tv,
  BadgeCheck,
} from "lucide-react";
import { AMENITY_META, type Venue, type AlertType } from "@/data/venues";
import { MatchRow } from "./MatchRow";
import { ShareButton } from "./ShareButton";
import { AttendanceButton } from "./AttendanceButton";
import { LiveConfirmButton } from "./LiveConfirmButton";
import { WazeAlertBanner } from "./WazeAlertBanner";
import { QuickReportPanel } from "./QuickReportPanel";
import { TorcidaPoll } from "./TorcidaPoll";
import { ClaimBanner } from "./ClaimBanner";
import { ClaimBarDialog } from "./ClaimBarDialog";
import { CouponDialog } from "./CouponDialog";
import { StatusOverlay } from "./StatusOverlay";
import { useAttendance } from "@/hooks/use-attendance";
import { useLiveConfirmations } from "@/hooks/use-live-confirmations";
import { ALERT_LABELS } from "@/hooks/use-alerts";
import type { ActiveAlert } from "@/data/venues";
import { formatVerified } from "@/lib/format-verified";
import { googleMapsRoute, uberLink, whatsappLink } from "@/lib/share";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  venue: Venue | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  alerts: ActiveAlert[];
  onReport: (venueId: string, type: AlertType) => void;
  onConfirmAlert: (venueId: string, alertId: string) => void;
}

export function VenueDetailsSheet({
  venue,
  open,
  onOpenChange,
  alerts,
  onReport,
  onConfirmAlert,
}: Props) {
  const attendance = useAttendance();
  const live = useLiveConfirmations();
  const [claimOpen, setClaimOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);

  if (!venue) return null;
  const operational = venue.operationalStatus === "open";
  const nextMatch = venue.matches[0];

  const handleReport = (type: AlertType) => {
    onReport(venue.id, type);
    toast.success(`Obrigado! Comunidade alertada (${ALERT_LABELS[type].label}).`);
  };

  const handleReserve = () => {
    const txt = nextMatch
      ? `Olá! Vi no MatchMap que vocês vão transmitir *${nextMatch.home} × ${nextMatch.away}* hoje. Queria reservar uma mesa.`
      : `Olá! Vi no MatchMap. Queria reservar uma mesa.`;
    window.open(whatsappLink(venue.whatsapp, txt), "_blank");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          <div className={cn("relative h-48 w-full", !operational && "opacity-60")}>
            <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-bold backdrop-blur">
              <Star className="h-3 w-3 fill-highlight text-highlight" />
              {venue.rating > 0 ? venue.rating.toFixed(1) : "novo"}
            </div>
          </div>
          <StatusOverlay status={venue.operationalStatus} />

          <SheetHeader className="px-6 pt-4">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-2xl">{venue.name}</SheetTitle>
              {venue.claimed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <BadgeCheck className="h-3 w-3" /> Verificado
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{venue.description}</p>
            <p className="flex items-center gap-1 text-xs text-emerald-300">
              <ShieldCheck className="h-3 w-3" /> Verificado {formatVerified(venue.lastVerified)}
            </p>
          </SheetHeader>

          <div className={cn("space-y-4 px-6 py-5", !operational && "opacity-60")}>
            {operational && (
              <LiveConfirmButton
                count={live.countFor(venue.id)}
                confirmed={live.hasConfirmed(venue.id)}
                onConfirm={() => {
                  const ok = live.confirm(venue.id);
                  if (ok) toast.success("Check-in feito! A comunidade agradece.");
                }}
              />
            )}

            <WazeAlertBanner alerts={alerts} onConfirm={(id) => onConfirmAlert(venue.id, id)} />

            {venue.matches.length > 0 && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Tv className="h-3 w-3" /> Jogos hoje
                </h4>
                {venue.matches.map((m) => (
                  <MatchRow key={m.id} match={m} venue={venue} />
                ))}
              </div>
            )}

            {venue.broadcastPackages.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pacotes do bar
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {venue.broadcastPackages.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300"
                    >
                      📡 {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                {venue.address}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> {venue.hours}
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" /> Entrada: {venue.entry}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {venue.phone}
              </li>
            </ul>

            {venue.amenities.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Comodidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-elevated px-3 py-1 text-xs"
                    >
                      <span>{AMENITY_META[a].emoji}</span> {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {venue.coupon && (
              <button
                onClick={() => setCouponOpen(true)}
                className="flex w-full items-center justify-between rounded-lg border border-highlight/40 bg-highlight/10 p-3 text-left transition hover:bg-highlight/20"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-highlight">
                    🎟 Cupom da casa
                  </p>
                  <p className="text-sm font-medium">{venue.coupon.label}</p>
                </div>
                <span className="text-xs text-highlight">Resgatar →</span>
              </button>
            )}

            {operational && (
              <>
                <AttendanceButton
                  count={attendance.countFor(venue.id)}
                  attending={attendance.isAttending(venue.id)}
                  onToggle={() => attendance.toggle(venue.id)}
                />
                <TorcidaPoll venue={venue} />
                <QuickReportPanel onReport={handleReport} />
              </>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => window.open(googleMapsRoute(venue.coords), "_blank")}
              >
                <Navigation className="h-4 w-4" /> Rota
              </Button>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => window.open(uberLink(venue.coords, venue.name), "_blank")}
              >
                <Car className="h-4 w-4" /> Uber
              </Button>
              <ShareButton venue={venue} />
              {operational && (
                <Button
                  onClick={handleReserve}
                  className="gap-2 bg-[var(--gradient-pitch)] font-semibold text-primary-foreground hover:opacity-90"
                >
                  Reservar
                </Button>
              )}
            </div>

            {!venue.claimed && !venue.suggested && (
              <ClaimBanner onOpen={() => setClaimOpen(true)} />
            )}
          </div>
        </SheetContent>
      </Sheet>
      <ClaimBarDialog venue={venue} open={claimOpen} onOpenChange={setClaimOpen} />
      <CouponDialog venue={venue} open={couponOpen} onOpenChange={setCouponOpen} />
    </>
  );
}
