import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Venue } from "@/data/venues";
import { VenueCard } from "./VenueCard";

interface Props {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function VenueList({ venues, selectedId, onSelect }: Props) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-3 p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {venues.length} {venues.length === 1 ? "local encontrado" : "locais encontrados"}
          </h2>
        </div>
        <AnimatePresence mode="popLayout">
          {venues.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
            >
              Nenhum local com todos esses filtros. Tente remover alguma tag.
            </motion.div>
          ) : (
            venues.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                active={selectedId === v.id}
                onClick={() => onSelect(v.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
