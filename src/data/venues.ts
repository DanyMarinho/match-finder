export type Amenity =
  | "Open Bar"
  | "Espaço Kids"
  | "Telão LED"
  | "Música Ao Vivo"
  | "Promoção de Petiscos";

export interface Venue {
  id: string;
  name: string;
  coords: [number, number];
  neighborhood: string;
  address: string;
  match: string;
  amenities: Amenity[];
  rating: number;
  entry: string;
  hours: string;
  phone: string;
  image: string;
  description: string;
}

export const AMENITY_META: Record<Amenity, { emoji: string; label: string }> = {
  "Open Bar": { emoji: "🍻", label: "Open Bar" },
  "Espaço Kids": { emoji: "🧸", label: "Espaço Kids" },
  "Telão LED": { emoji: "📺", label: "Telão LED" },
  "Música Ao Vivo": { emoji: "🎵", label: "Música Ao Vivo" },
  "Promoção de Petiscos": { emoji: "🍔", label: "Promoção de Petiscos" },
};

export const ALL_AMENITIES: Amenity[] = [
  "Open Bar",
  "Espaço Kids",
  "Telão LED",
  "Música Ao Vivo",
  "Promoção de Petiscos",
];

export const VENUES: Venue[] = [
  {
    id: "bar-do-gigante",
    name: "Bar do Gigante",
    coords: [-26.3045, -48.8487],
    neighborhood: "Centro",
    address: "Rua das Palmeiras, 120 — Centro, Joinville",
    match: "Final da Copa / Jogos de Quarta",
    amenities: ["Telão LED", "Promoção de Petiscos"],
    rating: 4.9,
    entry: "Grátis",
    hours: "17h — 02h",
    phone: "(47) 99999-1010",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70",
    description:
      "O point clássico dos torcedores no Centro. Telão de 120\" e petiscos em dose dupla durante o jogo.",
  },
  {
    id: "arena-sports-pub",
    name: "Arena Sports Pub",
    coords: [-26.2912, -48.841],
    neighborhood: "América",
    address: "Av. Brasil, 850 — América, Joinville",
    match: "Rodada do Brasileirão",
    amenities: ["Open Bar", "Telão LED", "Música Ao Vivo"],
    rating: 4.7,
    entry: "R$ 40",
    hours: "18h — 03h",
    phone: "(47) 98888-2020",
    image:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=70",
    description:
      "Pub esportivo com 6 telões, open bar de chopp e banda ao vivo após o apito final.",
  },
  {
    id: "familia-futebol-espetaria",
    name: "Família & Futebol Espetaria",
    coords: [-26.318, -48.85],
    neighborhood: "Anita Garibaldi",
    address: "Rua Anita Garibaldi, 540 — Anita Garibaldi, Joinville",
    match: "Clássico Regional",
    amenities: ["Espaço Kids", "Promoção de Petiscos"],
    rating: 4.6,
    entry: "R$ 15",
    hours: "16h — 00h",
    phone: "(47) 97777-3030",
    image:
      "https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=900&q=70",
    description:
      "Ambiente para a família toda: espaço kids monitorado e espetinhos em promoção durante o jogo.",
  },
];
