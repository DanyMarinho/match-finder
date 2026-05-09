export type Amenity =
  | "Open Bar"
  | "Espaço Kids"
  | "Telão LED"
  | "Música Ao Vivo"
  | "Promoção de Petiscos";

export type BroadcastPackage =
  | "Premiere"
  | "SporTV"
  | "ESPN"
  | "Prime Video"
  | "CazéTV"
  | "TV Aberta"
  | "Paramount+"
  | "Disney+";

export type Competition =
  | "Brasileirão"
  | "Série C"
  | "La Liga"
  | "Champions League"
  | "Libertadores"
  | "Copa do Brasil";

export interface Match {
  id: string;
  kickoff: string; // ISO
  home: string;
  away: string;
  competition: Competition;
  requiredPackage?: BroadcastPackage;
}

export type OperationalStatus = "open" | "maintenance" | "closed_today" | "full";

export type AlertType = "no_tv" | "no_sub" | "closed" | "full";

export interface ActiveAlert {
  id: string;
  type: AlertType;
  reportedAt: string; // ISO
  votes: number;
}

export interface Coupon {
  code: string;
  label: string;
  expiresInHours: number;
}

export interface Venue {
  id: string;
  name: string;
  coords: [number, number];
  neighborhood: string;
  address: string;
  amenities: Amenity[];
  rating: number;
  entry: string;
  hours: string;
  phone: string;
  whatsapp: string;
  image: string;
  description: string;
  team?: string;
  matches: Match[];
  broadcastPackages: BroadcastPackage[];
  lastVerified: string; // ISO
  operationalStatus: OperationalStatus;
  activeAlerts: ActiveAlert[];
  claimed: boolean;
  liveConfirmations: number;
  coupon?: Coupon;
  suggested?: boolean;
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

export const ALL_COMPETITIONS: Competition[] = [
  "Brasileirão",
  "Série C",
  "La Liga",
  "Champions League",
  "Libertadores",
  "Copa do Brasil",
];

export const JOINVILLE_NEIGHBORHOODS = [
  "Centro",
  "América",
  "Anita Garibaldi",
  "Atiradores",
  "Bucarein",
  "Costa e Silva",
  "Glória",
  "Itaum",
  "Saguaçu",
  "Santo Antônio",
  "Outro",
];

// Domingo, 10 de maio de 2026 — datas em UTC-3 convertidas para ISO
const day = "2026-05-10";
const t = (hh: string) => `${day}T${hh}:00-03:00`;

export const VENUES: Venue[] = [
  {
    id: "bar-do-gigante",
    name: "Bar do Gigante",
    coords: [-26.3045, -48.8487],
    neighborhood: "Centro",
    address: "Rua das Palmeiras, 120 — Centro, Joinville",
    amenities: ["Telão LED", "Promoção de Petiscos"],
    rating: 4.9,
    entry: "Grátis",
    hours: "17h — 02h",
    phone: "(47) 99999-1010",
    whatsapp: "47999991010",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70",
    description:
      'O point clássico dos torcedores no Centro. Telão de 120" e petiscos em dose dupla durante o jogo.',
    team: "Flamengo",
    matches: [
      {
        id: "fla-pal",
        kickoff: t("16:00"),
        home: "Flamengo",
        away: "Palmeiras",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
      {
        id: "jec-bru",
        kickoff: t("18:30"),
        home: "JEC",
        away: "Brusque",
        competition: "Série C",
        requiredPackage: "SporTV",
      },
    ],
    broadcastPackages: ["Premiere", "SporTV", "TV Aberta", "CazéTV"],
    lastVerified: t("15:10"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: true,
    liveConfirmations: 0,
    coupon: { code: "GIGANTE2X", label: "Chopp em dobro até o intervalo", expiresInHours: 2 },
  },
  {
    id: "arena-sports-pub",
    name: "Arena Sports Pub",
    coords: [-26.2912, -48.841],
    neighborhood: "América",
    address: "Av. Brasil, 850 — América, Joinville",
    amenities: ["Open Bar", "Telão LED", "Música Ao Vivo"],
    rating: 4.7,
    entry: "R$ 40",
    hours: "10h — 03h",
    phone: "(47) 98888-2020",
    whatsapp: "47988882020",
    image:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=70",
    description:
      "Pub esportivo com 6 telões, open bar de chopp e banda ao vivo após o apito final.",
    team: "Real Madrid",
    matches: [
      {
        id: "real-bar",
        kickoff: t("11:15"),
        home: "Real Madrid",
        away: "Barcelona",
        competition: "La Liga",
        requiredPackage: "ESPN",
      },
      {
        id: "cam-int",
        kickoff: t("18:30"),
        home: "Atlético-MG",
        away: "Internacional",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["ESPN", "Premiere", "Disney+", "Paramount+"],
    lastVerified: t("14:30"),
    operationalStatus: "open",
    activeAlerts: [
      {
        id: "a1",
        type: "full",
        reportedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        votes: 4,
      },
    ],
    claimed: false,
    liveConfirmations: 0,
    coupon: { code: "ARENA10", label: "10% OFF no petisco grande", expiresInHours: 2 },
  },
  {
    id: "familia-futebol-espetaria",
    name: "Família & Futebol Espetaria",
    coords: [-26.318, -48.85],
    neighborhood: "Anita Garibaldi",
    address: "Rua Anita Garibaldi, 540 — Anita Garibaldi, Joinville",
    amenities: ["Espaço Kids", "Promoção de Petiscos"],
    rating: 4.6,
    entry: "R$ 15",
    hours: "16h — 00h",
    phone: "(47) 97777-3030",
    whatsapp: "47977773030",
    image:
      "https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=900&q=70",
    description:
      "Ambiente para a família toda: espaço kids monitorado e espetinhos em promoção durante o jogo.",
    team: "Grêmio",
    matches: [
      {
        id: "gre-juv",
        kickoff: t("16:00"),
        home: "Grêmio",
        away: "Juventude",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
      {
        id: "spfc-cor",
        kickoff: t("18:30"),
        home: "São Paulo",
        away: "Corinthians",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["TV Aberta", "CazéTV"],
    lastVerified: t("12:00"),
    operationalStatus: "maintenance",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
  },
];
