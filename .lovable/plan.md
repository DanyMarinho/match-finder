## MatchMap v2 — Evolução completa

Stack mantida: React, Tailwind v4, shadcn, Leaflet, framer-motion, vaul. Tudo client-side (localStorage para persistência colaborativa simulada).

---

### 1. Dados reais — domingo 10/05/2026

`src/data/venues.ts` reescrito:

`Match`: `{ id, kickoff (ISO), home, away, competition, league, requiredPackage? }`

`Venue` ganha:
- `matches: Match[]`, `team`, `whatsapp`
- `broadcastPackages: string[]`, `lastVerified: string` (ISO)
- `coupon?: { code, label, expiresInHours }`
- **`operationalStatus`**: `"open" | "maintenance" | "closed_today" | "full"`
- **`activeAlerts`**: `Array<{ id, type: 'no_tv' | 'no_sub' | 'closed' | 'full', reportedAt: string, votes: number }>`
- **`claimed`**: `boolean`
- **`liveConfirmations`**: `number` (seed inicial)
- **`suggested?`**: `boolean` (para indicações da comunidade)

Mock 10/05/2026 (com mistura de status para demonstrar UI):
- **Bar do Gigante** — `open`, `claimed: true`. Flamengo×Palmeiras 16h, JEC×Brusque 18h30 (Premiere/SporTV).
- **Arena Sports Pub** — `open`, `claimed: false`. Real×Barça 11h15, Atlético-MG×Inter 18h30 (ESPN/Premiere).
- **Família & Futebol Espetaria** — `maintenance`, `claimed: false`. Grêmio×Juventude 16h, SP×Corinthians 18h30.

---

### 2. Status "AO VIVO" — Tailwind v4 (dot + ping)

Helper `src/lib/match-status.ts`: `getMatchStatus(kickoff)` → `"live" | "upcoming" | "ended"`.

`LiveBadge.tsx` (sintaxe v4-safe):
```tsx
<span className="relative flex h-2.5 w-2.5">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
</span>
```

LiveBadge é **suprimido** quando `operationalStatus !== "open"`.

---

### 3. Hover sincronizado Card ↔ Pino

`useVenueFilters` ganha `hoveredId`. Card aplica borda laranja em hover; `VenueMap` re-renderiza ícone via `buildPinIcon(state)`.

---

### 4. Mobile Drawer (vaul, arrastável)

Substitui Tabs no mobile. Mapa fullscreen + drawer com snap points (~30%/~90%). Conteúdo: filtros + lista. Desktop mantém split 40/60.

---

### 5. Filtros de competição/time

`CompetitionChips`: "Brasileirão", "La Liga", "Champions", "Série C". Hook ganha `competitionFilter`. Busca varre `home`, `away`, `competition`.

---

### 6. Geolocalização + distância

`src/lib/geo.ts` (haversine), `useUserLocation()`. Botão "📍 Perto de mim" ordena por distância. Botão flutuante `LocateButton` no canto sup. dir. do mapa.

---

### 7. FOMO determinístico

`useAttendance()`:
- Seed determinística: `hash(venue.id) % 28 + 8`.
- `attending` por venue+data em localStorage.
- Botão "🔥 Vou assistir aqui" no Sheet.

---

### 8. Compartilhar via WhatsApp

`ShareButton` usa `navigator.share` ou fallback `wa.me/?text=`. Mensagem com deep-link `?bar=${id}`.

---

### 9. Reserva + Rota + Uber

- **Reservar mesa** → `wa.me/${whatsapp}` parametrizado com nome do jogo.
- **Traçar rota** → Google Maps `dir/?api=1&destination=lat,lng`.
- **Pedir Uber** → `m.uber.com/ul/?action=setPickup...`.

Reservar mesa **oculto** quando `operationalStatus !== "open"`.

---

### 10. Cupons + Enquete de torcida

- `CouponDialog` com código + countdown 2h em localStorage.
- `TorcidaPoll` casa vs. visitante por venue+match.

---

### 11. Empty state + UX

`VenueList` empty state com `BeerOff` (lucide) + botão "Limpar filtros".

---

### 12. Camada de Confiabilidade

**12.1 Pacotes de transmissão** — seção no Sheet listando `broadcastPackages`. Cada match comparado com `requiredPackage`: ✅ verde "Transmissão garantida" ou ⚠ âmbar "Pacote não confirmado".

**12.2 `lastVerified`** — formato relativo ("Hoje 15:10"). `ShieldCheck` esmeralda no card e bloco visível no Sheet.

**12.3 Report da comunidade** (legacy, agora unificado em §13).

---

### 13. Módulo Waze de Alertas

**13.1 Visual de status operacional**
- `operationalStatus !== "open"` → card e Sheet com `opacity-60`, LiveBadge desabilitado.
- Tarja full-width no topo do card:
  - `maintenance`: amber-500 — "🔧 Em manutenção / reformas"
  - `closed_today`: red-500 — "🚫 Fechado hoje"
  - `full`: orange-500 — "🔥 Casa cheia / sem mesas"
- Botão "Reservar mesa" oculto nesses estados.

**13.2 Pinos de alerta no mapa**
- Se `activeAlerts` recente (<3h) existir, `buildPinIcon` retorna SVG `TriangleAlert` (amber-500, ou red-500 se `type === 'closed'`), com glow pulsante.

**13.3 `<WazeAlertBanner alerts={...} />`**
- Topo do Sheet, lista alertas com ícone, label legível ("Sem sinal há 12 min — 4 pessoas reportaram"), botão "Confirmar" (incrementa `votes`).

**13.4 Painel de relato rápido**
- 3 botões grandes no Sheet: "📵 Sem sinal", "🔥 Lotado", "🚪 Fechado".
- Click → `useAlerts()` adiciona `{ type, reportedAt: now, votes: 1 }` em localStorage por venue → toast "Obrigado! Comunidade alertada."
- Se >=3 votos no mesmo tipo em <1h, eleva à tarja oficial.

---

### 14. Funil de Monetização — Reivindicação

- Para `claimed: false`, banner fixo no rodapé do Sheet:
  - bg `slate-900`, borda esquerda `primary`, texto: "É dono deste bar? Reivindique o perfil para responder alertas e atualizar status ao vivo."
  - Botão "Reivindicar perfil" abre `<ClaimBarDialog>`.
- `ClaimBarDialog` (form validado com **zod**):
  - Nome do dono (max 100), CNPJ/CPF (regex BR), Telefone, RadioGroup de plano: "Básico (grátis)", "Premium R$ 99/mês", "Destaque R$ 249/mês".
  - Submit → toast "Recebemos sua solicitação. Em breve nosso time entra em contato." (sem backend; salva intent em localStorage).
- Para `claimed: true`, exibir selo discreto ✓ "Perfil verificado" no header do Sheet.

---

### 15. Check-in ao Vivo (validação positiva)

- `useLiveConfirmations()`: seed inicial determinística (`hash(venue.id) % 12`); botão alterna confirmação do dia atual em localStorage.
- Botão de destaque verde no topo do Sheet (acima do WazeBanner): **"✅ Confirmar que está passando agora"**.
- Click → incrementa contador + toast animado "Check-in feito! Você ajudou outros torcedores."
- Card exibe badge verde com `CheckCheck` (lucide): "Sinal confirmado por 23 torcedores".
- Quando `activeAlerts` e `liveConfirmations` coexistem, ambos aparecem (UX honesta — usuário decide).

---

### 16. Radar da Comunidade — Sugerir novo bar

- Botão secundário no `Header` (e topo da sidebar mobile): "📍 Conhece um lugar? Indique aqui".
- `<SuggestVenueDialog>` (validado com zod):
  - Nome do local, bairro de Joinville (Select com bairros principais + opção outro), competições típicas (multi-select chips).
- Submit → adiciona à lista local com `suggested: true`, status `"open"`, sem coords reais (não aparece no mapa, só na lista) + badge cinza "💡 Sugerido pela comunidade — em verificação".
- Toast: "Obrigado! Vamos verificar e adicionar ao mapa em breve."
- Persistência em localStorage para sobreviver ao refresh.

---

### Arquivos a criar

**Libs/utils:**
- `src/lib/match-status.ts`, `geo.ts`, `share.ts`, `format-verified.ts`, `hash.ts`, `validation-schemas.ts` (zod)

**Hooks:**
- `use-user-location.ts`, `use-attendance.ts`, `use-coupons.ts`, `use-poll.ts`, `use-alerts.ts`, `use-live-confirmations.ts`, `use-suggested-venues.ts`, `use-claim-intents.ts`

**Componentes (`src/components/matchmap/`):**
- `LiveBadge.tsx`, `MatchRow.tsx`, `CompetitionChips.tsx`, `MobileDrawer.tsx`
- `LocateButton.tsx`, `AttendanceButton.tsx`, `ShareButton.tsx`
- `CouponDialog.tsx`, `TorcidaPoll.tsx`
- `TrustBadge.tsx`, `BroadcastPackages.tsx`
- `StatusOverlay.tsx` (tarja de manutenção/fechado/full)
- `WazeAlertBanner.tsx`, `QuickReportPanel.tsx`
- `LiveConfirmButton.tsx`, `ConfirmationsBadge.tsx`
- `ClaimBanner.tsx`, `ClaimBarDialog.tsx`
- `SuggestVenueDialog.tsx`, `SuggestedBadge.tsx`

### Arquivos a editar

- `src/data/venues.ts` — schema completo + dados 10/05.
- `src/hooks/use-venue-filters.ts` — hover, competição, distância, mescla com sugestões.
- `src/components/matchmap/VenueCard.tsx`, `VenueDetailsSheet.tsx`, `VenueMap.tsx`, `VenueList.tsx`, `Header.tsx`.
- `src/routes/index.tsx` — Drawer mobile + parâmetro `?bar=` para deep-link.

---

### Princípios de segurança aplicados

- Todos os formulários (Claim, Suggest, Register) validam com **zod** + `encodeURIComponent` em URLs externas (WhatsApp).
- Limites de comprimento por campo; sem `dangerouslySetInnerHTML`.
- Nenhum dado sensível logado.

---

### Fora de escopo

- Backend / persistência real (tudo em localStorage; reports não saem do navegador).
- Auth, pagamento real do plano Premium.
- Geocoding de bares sugeridos (entram só na lista, sem pino).
