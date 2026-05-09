import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Phone, Ticket, Tv } from "lucide-react";
import { AMENITY_META, type Venue } from "@/data/venues";

interface Props {
  venue: Venue | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function VenueDetailsSheet({ venue, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
        {venue && (
          <>
            <div className="relative h-48 w-full">
              <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <Star className="h-4 w-4 fill-highlight text-highlight" />
                  {venue.rating.toFixed(1)}
                </div>
              </div>
            </div>
            <SheetHeader className="px-6 pt-4">
              <SheetTitle className="text-2xl">{venue.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{venue.description}</p>
            </SheetHeader>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-lg border border-highlight/30 bg-highlight/10 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-highlight">
                  <Tv className="h-4 w-4" /> Em transmissão hoje
                </div>
                <p className="mt-1 text-sm">{venue.match}</p>
              </div>

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

              <Button className="w-full bg-[var(--gradient-pitch)] font-semibold text-primary-foreground hover:opacity-90">
                Reservar mesa
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
