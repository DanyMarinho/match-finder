import { useLocalStorage } from "./use-local-storage";
import type { Venue } from "@/data/venues";
import type { SuggestVenueInput } from "@/lib/validation-schemas";

interface SuggestedVenue {
  id: string;
  name: string;
  neighborhood: string;
  competitions: string[];
  submittedAt: string;
}

export function useSuggestedVenues() {
  const [list, setList] = useLocalStorage<SuggestedVenue[]>(
    "matchmap:suggested:v1",
    [],
  );

  const submit = (input: SuggestVenueInput) => {
    const id = `sug-${Date.now()}`;
    setList((prev) => [
      ...prev,
      {
        id,
        ...input,
        submittedAt: new Date().toISOString(),
      },
    ]);
  };

  const asVenues = (): Venue[] =>
    list.map((s) => ({
      id: s.id,
      name: s.name,
      coords: [-26.3, -48.85],
      neighborhood: s.neighborhood,
      address: `${s.neighborhood}, Joinville (sugerido)`,
      amenities: [],
      rating: 0,
      entry: "—",
      hours: "—",
      phone: "—",
      whatsapp: "",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=70",
      description: `Sugerido pela comunidade. Costuma transmitir: ${s.competitions.join(", ")}.`,
      matches: [],
      broadcastPackages: [],
      lastVerified: s.submittedAt,
      operationalStatus: "open",
      activeAlerts: [],
      claimed: false,
      liveConfirmations: 0,
      suggested: true,
    }));

  return { list, submit, asVenues };
}
