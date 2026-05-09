import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Venue } from "@/data/venues";
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { BeerOff } from "lucide-react";

interface Props {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onClear: () => void;
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
  attendanceFor,
  liveConfirmationsFor,
  alertsCountFor,
  distanceFor,
}: Props) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-3 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {venues.length} {venues.length === 1 ? "local encontrado" : "locais encontrados"}
        </h2>
        <AnimatePresence mode="popLayout">
          {venues.length === 0 ? (
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
            venues.map((v) => (
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
      </div>
    </ScrollArea>
  );
}
