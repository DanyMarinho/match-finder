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
  kidsPremium?: { hasMonitors: boolean; tableVisibility: boolean };
  petFriendly?: boolean;
  parking?: boolean;
  covered?: boolean;
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
  {
    id: "opa-bierhaws",
    name: "Opa Bierhaws",
    coords: [-26.2638, -48.8312],
    neighborhood: "Saguaçu",
    address: "Rua Ottokar Doerffel, 1180 — Saguaçu, Joinville",
    amenities: ["Telão LED", "Promoção de Petiscos", "Música Ao Vivo"],
    rating: 4.8,
    entry: "Grátis",
    hours: "16h — 01h",
    phone: "(47) 99666-4040",
    whatsapp: "47996664040",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=70",
    description:
      "Cervejaria artesanal com 18 torneiras, chopp germânico e telão dedicado ao Brasileirão.",
    team: "Internacional",
    matches: [
      {
        id: "int-bah",
        kickoff: t("16:00"),
        home: "Internacional",
        away: "Bahia",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
      {
        id: "flu-vas",
        kickoff: t("18:30"),
        home: "Fluminense",
        away: "Vasco",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["Premiere", "SporTV", "TV Aberta"],
    lastVerified: t("15:40"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
    coupon: { code: "OPACHOPP", label: "Caneca de chopp por R$ 12 até 18h", expiresInHours: 3 },
  },
  {
    id: "boteco-da-ilha",
    name: "Boteco da Ilha",
    coords: [-26.2755, -48.858],
    neighborhood: "Santo Antônio",
    address: "Rua Santa Catarina, 322 — Santo Antônio, Joinville",
    amenities: ["Telão LED", "Promoção de Petiscos"],
    rating: 4.7,
    entry: "R$ 10",
    hours: "15h — 02h",
    phone: "(47) 99555-5050",
    whatsapp: "47995555050",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=70",
    description:
      "Caldeirão de torcida — mesas coletivas, hino antes do jogo e transmissão simultânea de Champions e Brasileirão.",
    team: "PSG",
    matches: [
      {
        id: "bay-psg",
        kickoff: t("16:45"),
        home: "Bayern",
        away: "PSG",
        competition: "Champions League",
        requiredPackage: "Paramount+",
      },
      {
        id: "spfc-cor-2",
        kickoff: t("18:30"),
        home: "São Paulo",
        away: "Corinthians",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["Paramount+", "Premiere", "SporTV", "TV Aberta"],
    lastVerified: t("15:55"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: true,
    liveConfirmations: 0,
  },
  {
    id: "pizzaria-anita",
    name: "Pizzaria & Esportes Anita",
    coords: [-26.3201, -48.8478],
    neighborhood: "Anita Garibaldi",
    address: "Rua Anita Garibaldi, 1820 — Anita Garibaldi, Joinville",
    amenities: ["Espaço Kids", "Telão LED", "Promoção de Petiscos"],
    rating: 4.8,
    entry: "Grátis",
    hours: "11h — 23h",
    phone: "(47) 99444-6060",
    whatsapp: "47994446060",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=70",
    description:
      "Vibe família, salão climatizado, espaço kids monitorado e visão ampla do telão para todas as mesas.",
    matches: [
      {
        id: "cru-bot",
        kickoff: t("16:00"),
        home: "Cruzeiro",
        away: "Botafogo",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["Premiere", "TV Aberta", "CazéTV"],
    lastVerified: t("13:20"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
    coupon: { code: "ANITAKIDS", label: "Rodízio infantil grátis até 17h", expiresInHours: 4 },
  },
  {
    id: "gulden-bier",
    name: "Cervejaria Gulden Bier",
    coords: [-26.2885, -48.8395],
    neighborhood: "América",
    address: "Rua Visconde de Taunay, 905 — América, Joinville",
    amenities: ["Telão LED", "Promoção de Petiscos"],
    rating: 4.9,
    entry: "Grátis",
    hours: "17h — 00h",
    phone: "(47) 99333-7070",
    whatsapp: "47993337070",
    image:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=900&q=70",
    description:
      "Cervejaria de degustação com acústica tratada e ambiente climatizado para curtir o jogo sem gritaria.",
    matches: [
      {
        id: "bay-psg-2",
        kickoff: t("16:45"),
        home: "Bayern",
        away: "PSG",
        competition: "Champions League",
        requiredPackage: "Paramount+",
      },
      {
        id: "bra-uru",
        kickoff: t("21:00"),
        home: "Brasil",
        away: "Uruguai",
        competition: "Brasileirão",
        requiredPackage: "TV Aberta",
      },
    ],
    broadcastPackages: ["Paramount+", "TV Aberta", "CazéTV"],
    lastVerified: t("15:00"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
  },
  {
    id: "espetaria-do-zeca",
    name: "Espetaria do Zeca",
    coords: [-26.2548, -48.8195],
    neighborhood: "Iririú",
    address: "Rua Iririú, 2410 — Iririú, Joinville",
    amenities: ["Telão LED", "Promoção de Petiscos"],
    rating: 4.7,
    entry: "Grátis",
    hours: "16h — 01h",
    phone: "(47) 99222-8080",
    whatsapp: "47992228080",
    image:
      "https://images.unsplash.com/photo-1485872299712-c1cc78b9eee2?auto=format&fit=crop&w=900&q=70",
    description:
      "Caldeirão da torcida iririuense. Telão na calçada coberta, espetinhos no capricho e cachorros bem-vindos.",
    team: "JEC",
    matches: [
      {
        id: "fla-pal-2",
        kickoff: t("16:00"),
        home: "Flamengo",
        away: "Palmeiras",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
      {
        id: "jec-bru-2",
        kickoff: t("18:30"),
        home: "JEC",
        away: "Brusque",
        competition: "Série C",
        requiredPackage: "SporTV",
      },
    ],
    broadcastPackages: ["Premiere", "SporTV", "Prime Video"],
    lastVerified: t("15:25"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
    petFriendly: true,
    covered: true,
  },
  {
    id: "petisqueira-gloria",
    name: "Restaurante e Petisqueira Glória",
    coords: [-26.2792, -48.8255],
    neighborhood: "Glória",
    address: "Rua Pastor Guilherme Rau, 320 — Glória, Joinville",
    amenities: ["Espaço Kids", "Telão LED", "Promoção de Petiscos"],
    rating: 4.8,
    entry: "Grátis",
    hours: "11h — 23h",
    phone: "(47) 99111-9090",
    whatsapp: "47991119090",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=70",
    description:
      "Domingão clássico em família — espaço kids monitorado e mesas com visão direta para o telão principal.",
    matches: [
      {
        id: "gre-juv-2",
        kickoff: t("16:00"),
        home: "Grêmio",
        away: "Juventude",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
      {
        id: "spfc-cor-3",
        kickoff: t("18:30"),
        home: "São Paulo",
        away: "Corinthians",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["Premiere", "TV Aberta", "CazéTV"],
    lastVerified: t("12:40"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
    kidsPremium: { hasMonitors: true, tableVisibility: true },
  },
  {
    id: "haensch-bier",
    name: "Haensch Bier",
    coords: [-26.2685, -48.8625],
    neighborhood: "Vila Nova",
    address: "Rua Anaburgo, 1450 — Vila Nova, Joinville",
    amenities: ["Telão LED", "Promoção de Petiscos"],
    rating: 4.6,
    entry: "Grátis",
    hours: "16h — 00h",
    phone: "(47) 99000-1212",
    whatsapp: "47990001212",
    image:
      "https://images.unsplash.com/photo-1571613914063-39763b3a52cf?auto=format&fit=crop&w=900&q=70",
    description:
      "Pub germânico com estacionamento próprio e área externa coberta — pega chuva de Joinville sem encharcar.",
    matches: [
      {
        id: "dor-bay",
        kickoff: t("12:30"),
        home: "Dortmund",
        away: "Leverkusen",
        competition: "Brasileirão",
        requiredPackage: "CazéTV",
      },
      {
        id: "int-bah-2",
        kickoff: t("16:00"),
        home: "Internacional",
        away: "Bahia",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["CazéTV", "Premiere", "Prime Video"],
    lastVerified: t("14:00"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
    parking: true,
    covered: true,
  },
  {
    id: "madrugadao-lanches",
    name: "Madrugadão Lanches",
    coords: [-26.3098, -48.8412],
    neighborhood: "Centro",
    address: "Rua Visconde de Taunay, 60 — Via Gastronômica, Joinville",
    amenities: ["Telão LED", "Música Ao Vivo", "Promoção de Petiscos"],
    rating: 4.5,
    entry: "Grátis",
    hours: "18h — 05h",
    phone: "(47) 98888-1313",
    whatsapp: "47988881313",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=70",
    description:
      "Pós-jogo garantido — TVs em todos os ângulos e cozinha aberta até de madrugada para os retardatários.",
    matches: [
      {
        id: "flu-vas-2",
        kickoff: t("18:30"),
        home: "Fluminense",
        away: "Vasco",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
      {
        id: "sant-cru",
        kickoff: t("21:00"),
        home: "Santos",
        away: "Cruzeiro",
        competition: "Brasileirão",
        requiredPackage: "Prime Video",
      },
    ],
    broadcastPackages: ["Premiere", "Prime Video", "TV Aberta"],
    lastVerified: t("16:15"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
  },
  {
    id: "pizzaria-baggio",
    name: "Pizzaria Baggio",
    coords: [-26.2702, -48.8358],
    neighborhood: "Saguaçu",
    address: "Rua Blumenau, 1620 — Saguaçu, Joinville",
    amenities: ["Espaço Kids", "Telão LED"],
    rating: 4.8,
    entry: "Grátis",
    hours: "11h — 23h",
    phone: "(47) 98777-1414",
    whatsapp: "47987771414",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=70",
    description:
      "Pizzaria climatizada com ambiente familiar — ótima opção para assistir o jogo com as crianças.",
    matches: [
      {
        id: "cru-bot-2",
        kickoff: t("16:00"),
        home: "Cruzeiro",
        away: "Botafogo",
        competition: "Brasileirão",
        requiredPackage: "Premiere",
      },
    ],
    broadcastPackages: ["Premiere", "CazéTV", "TV Aberta"],
    lastVerified: t("13:50"),
    operationalStatus: "open",
    activeAlerts: [],
    claimed: false,
    liveConfirmations: 0,
    kidsPremium: { hasMonitors: false, tableVisibility: true },
  },
];
