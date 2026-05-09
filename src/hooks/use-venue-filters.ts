import { useMemo, useState } from "react";
import { VENUES, type Amenity, type Venue } from "@/data/venues";

export function useVenueFilters() {
  const [active, setActive] = useState<Set<Amenity>>(new Set());
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggle = (a: Amenity) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });

  const clear = () => setActive(new Set());

  const filtered: Venue[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VENUES.filter((v) => {
      for (const a of active) if (!v.amenities.includes(a)) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.match.toLowerCase().includes(q) ||
        v.neighborhood.toLowerCase().includes(q)
      );
    });
  }, [active, query]);

  const selected = useMemo(
    () => VENUES.find((v) => v.id === selectedId) ?? null,
    [selectedId],
  );

  return {
    active,
    toggle,
    clear,
    query,
    setQuery,
    filtered,
    selectedId,
    setSelectedId,
    selected,
  };
}
