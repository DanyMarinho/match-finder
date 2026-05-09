import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Venue } from "@/data/venues";
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { BeerOff, MapPin } from "lucide-react";

interface Props {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onClear: () => void;
  onSuggest: () => void;
  attendanceFor: (id: string) => number;
  liveConfirmationsFor: (id: string) => number;
  alertsCountFor: (id: string) => number;
  distanceFor: (coords: [number, number]) => number | null;
}

export function VenueList({
  venues,
  selectedId,
  onSelect,
  onHover,
  onClear,
  onSuggest,
  attendanceFor,
  liveConfirmationsFor,
  alertsCountFor,
  distanceFor,
}: Props) {
  // Suggested venues always render at the bottom of the list.
  const ordered = [
    ...venues.filter((v) => !v.suggested),
    ...venues.filter((v) => v.suggested),
  ];

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-3 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {venues.length} {venues.length === 1 ? "local encontrado" : "locais encontrados"}
        </h2>
        <AnimatePresence mode="popLayout">
          {ordered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center"
            >
              <BeerOff className="h-10 w-10 text-muted-foreground/60" />
              <div>
                <p className="text-sm font-semibold">Nada por aqui ainda</p>
                <p className="text-xs text-muted-foreground">
                  Tente remover algum filtro ou competição.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={onClear}>
                Limpar filtros
              </Button>
            </motion.div>
          ) : (
            ordered.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                active={selectedId === v.id}
                onClick={() => onSelect(v.id)}
                onHover={onHover}
                attendance={attendanceFor(v.id)}
                liveConfirmations={liveConfirmationsFor(v.id)}
                alertsCount={alertsCountFor(v.id)}
                distanceKm={distanceFor(v.coords)}
              />
            ))
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onSuggest}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/60 hover:text-foreground"
        >
          <MapPin className="h-4 w-4 text-primary" />
          Faltou seu bar favorito? Indique aqui
        </button>
      </div>
    </ScrollArea>
  );
}
