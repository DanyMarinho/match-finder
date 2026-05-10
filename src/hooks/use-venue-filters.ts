import { useMemo, useState } from "react";
import {
  VENUES,
  type Amenity,
  type Competition,
  type Venue,
} from "@/data/venues";
import { haversine, type LatLng } from "@/lib/geo";
import { useSuggestedVenues } from "./use-suggested-venues";

export function useVenueFilters() {
  const [active, setActive] = useState<Set<Amenity>>(new Set());
  const [competitions, setCompetitions] = useState<Set<Competition>>(new Set());
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);

  const { asVenues, submit: submitSuggestion } = useSuggestedVenues();

  const allVenues = useMemo<Venue[]>(() => [...VENUES, ...asVenues()], [asVenues]);

  const toggle = (a: Amenity) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });

  const toggleCompetition = (c: Competition) =>
    setCompetitions((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const clear = () => {
    setActive(new Set());
    setCompetitions(new Set());
    setQuery("");
  };

  const filtered: Venue[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allVenues.filter((v) => {
      for (const a of active) if (!v.amenities.includes(a)) return false;
      if (competitions.size > 0) {
        const matches = v.matches.some((m) => competitions.has(m.competition));
        if (!matches) return false;
      }
      if (!q) return true;
      const inMatches = v.matches.some(
        (m) =>
          m.home.toLowerCase().includes(q) ||
          m.away.toLowerCase().includes(q) ||
          m.competition.toLowerCase().includes(q),
      );
      return (
        v.name.toLowerCase().includes(q) ||
        v.neighborhood.toLowerCase().includes(q) ||
        (v.team?.toLowerCase().includes(q) ?? false) ||
        inMatches
      );
    });

    if (sortByDistance && userCoords) {
      list = [...list].sort((a, b) => {
        if (a.suggested && !b.suggested) return 1;
        if (!a.suggested && b.suggested) return -1;
        return haversine(userCoords, a.coords) - haversine(userCoords, b.coords);
      });
    } else {
      // Popularidade: confirmações ao vivo + votos em alertas + rating sobem o ranking.
      const popularity = (v: Venue) => {
        const alertVotes = v.activeAlerts.reduce((s, a) => s + a.votes, 0);
        return v.liveConfirmations * 3 + alertVotes + v.rating * 2;
      };
      list = [...list].sort((a, b) => {
        if (a.suggested && !b.suggested) return 1;
        if (!a.suggested && b.suggested) return -1;
        return popularity(b) - popularity(a);
      });
    }

    return list;
  }, [allVenues, active, competitions, query, sortByDistance, userCoords]);

  const selected = useMemo(
    () => allVenues.find((v) => v.id === selectedId) ?? null,
    [allVenues, selectedId],
  );

  const distanceTo = (coords: LatLng): number | null =>
    userCoords ? haversine(userCoords, coords) : null;

  return {
    // amenity filters
    active,
    toggle,
    // competition filters
    competitions,
    toggleCompetition,
    // search
    query,
    setQuery,
    clear,
    // selection
    filtered,
    selectedId,
    setSelectedId,
    selected,
    // hover sync
    hoveredId,
    setHoveredId,
    // distance
    sortByDistance,
    setSortByDistance,
    userCoords,
    setUserCoords,
    distanceTo,
    // suggestions
    submitSuggestion,
  };
}
