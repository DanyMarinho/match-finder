import { motion } from "framer-motion";
import { Star, MapPin, Tv } from "lucide-react";
import { AMENITY_META, type Venue } from "@/data/venues";
import { cn } from "@/lib/utils";

interface Props {
  venue: Venue;
  active: boolean;
  onClick: () => void;
}

export function VenueCard({ venue, active, onClick }: Props) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "group block w-full overflow-hidden rounded-xl border bg-card text-left transition-colors",
        active
          ? "border-primary shadow-[var(--shadow-glow)]"
          : "border-border hover:border-primary/40",
      )}
    >
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
          {venue.rating.toFixed(1)}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <div>
          <h3 className="font-semibold leading-tight">{venue.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {venue.neighborhood}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-highlight/10 px-2 py-1 text-xs text-highlight">
          <Tv className="h-3 w-3" />
          <span className="truncate font-medium">{venue.match}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {venue.amenities.map((a) => (
            <span
              key={a}
              title={a}
              className="rounded-full bg-surface-elevated px-1.5 py-0.5 text-[11px]"
            >
              {AMENITY_META[a].emoji}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
