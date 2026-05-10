# Correção do Crash + Auditoria MatchMap v2

## Diagnóstico

**Erro raiz (SSR crash)**: `react-leaflet` e `leaflet` acessam `window` no escopo do módulo. Como `VenueMap` é importado estaticamente em `src/routes/index.tsx`, ele entra no bundle SSR e quebra com `ReferenceError: window is not defined`. Isso acaba na Error Boundary "This page didn't load".

**Erro secundário (runtime)**: `FlyTo` chama `map.flyTo(...)` num map ainda não dimensionado (containers `flex-1` nascem com 0px durante o primeiro paint), gerando `Invalid LatLng object: (NaN, NaN)` quando o Leaflet tenta `unproject` numa tela sem tamanho.

**Auditoria**: `geo.ts` (Haversine) e `hash.ts`/`seedRange` já estão corretos e determinísticos — não há NaN ali. A base de dados tem só 3 bares; o usuário quer 6.

## Mudanças

### 1. Corrigir crash de SSR — lazy load do mapa

Em `src/routes/index.tsx`:

- Remover `import { VenueMap } from ".../VenueMap"`.
- Trocar por `const VenueMap = React.lazy(() => import("@/components/matchmap/VenueMap").then(m => ({ default: m.VenueMap })))`.
- Envolver as duas instâncias (desktop + mobile) num `<Suspense fallback={...}>` com skeleton `bg-slate-900 animate-pulse`.
- Garantir que `lazy`/`Suspense` venham do `react`.

Como `lazy()` só hidrata no client, leaflet nunca é avaliado no servidor. `useMap` e `L.divIcon` continuam internos ao `VenueMap` (já estão).

### 2. Hardening do `FlyTo` (corrige `Invalid LatLng (NaN, NaN)`)

Em `src/components/matchmap/VenueMap.tsx`:

- No `FlyTo`, guardar contra `map.getSize().x === 0` e contra `coords` inválidos antes de chamar `flyTo`. Disparar `map.invalidateSize()` antes do `flyTo` quando necessário.
- Validar que `venue.coords` são números finitos.

### 3. Auditoria de `seedRange` e `geo.ts`

- `src/lib/hash.ts`: `seedRange` já é determinístico (`hash` djb2 + `Math.abs` + `% (max-min)`); só vou explicitar guarda contra `max <= min`. **Nenhuma mudança funcional necessária**, mas adicionar comentário/clamp por robustez.
- `src/lib/geo.ts`: Haversine já usa `**2` corretamente (operador suportado em ES2016+, compilado pelo Vite). **Nenhuma mudança necessária** — confirmado por inspeção.

### 4. Adicionar 3 novos bares em `src/data/venues.ts`

Total: **6 bares fixos** com coords reais de Joinville:


| Bar                       | Bairro          | Coords             | Vibe                              | Jogos                                                 |
| ------------------------- | --------------- | ------------------ | --------------------------------- | ----------------------------------------------------- |
| Opa Bierhaws              | Saguaçu         | -26.2638, -48.8312 | Chopp artesanal                   | Brasileirão (Inter×Bahia 16h, Fluminense×Vasco 18h30) |
| Boteco da Ilha            | Santo Antônio   | -26.2755, -48.8580 | Caldeirão                         | Champions (Bayern×PSG 16h45) + Brasileirão noturno    |
| Pizzaria & Esportes Anita | Anita Garibaldi | -26.3201, -48.8478 | Família, climatizada, Espaço Kids | Brasileirão (Cruzeiro×Botafogo 16h)                   |


Cada um com: `broadcastPackages`, `lastVerified`, `operationalStatus: "open"`, `claimed: false` (Opa) / `true` (Boteco), `liveConfirmations: 0`, `activeAlerts: []`. Pizzaria Anita recebe `coupon` ("Rodízio infantil grátis até 17h").

## Auditoria — status atual confirmado


| Item                                        | Status                                       |
| ------------------------------------------- | -------------------------------------------- |
| MobileDrawer (vaul) substitui Tabs          | ✅ implementado                               |
| LiveBadge com ping verde (Tailwind v4 safe) | ✅ via dot + ping ring                        |
| Hover no card destaca pino (laranja)        | ✅ `hoveredId` + re-render por `key`          |
| "Perto de mim" + Haversine                  | ✅ funcional                                  |
| Cupom + countdown + Reservar via WhatsApp   | ✅ `CouponDialog` + `whatsappLink`            |
| Banner "Reivindicar" para `claimed: false`  | ✅ `ClaimBanner`                              |
| Attendance + Enquete persistidos            | ✅ via `useLocalStorage`                      |
| Alertas Waze + ícone amber/red no mapa      | ✅ `buildPinIcon('alert' / 'alert-critical')` |
| Check-in com trava 1/dia em localStorage    | ✅ chave `matchmap_confirmed_<id>_<data>`     |
| Indicar lugar (Radar) + injeção temporária  | ✅ `SuggestVenueDialog` + tarja "Em Análise"  |


Tudo presente — após o fix de SSR a v2 fica 100% navegável.

## Riscos futuros / pontos a monitorar

1. **Hidratação Leaflet**: se algum dia `VenueDetailsSheet` ou outro componente importar leaflet diretamente, o SSR quebra de novo. Manter leaflet isolado dentro de `VenueMap.tsx`.
2. `**map.flyTo` em containers de 0px**: ao trocar layout (drawer abrindo/fechando) o mapa pode precisar de `invalidateSize()`. Adicionar `useEffect` que escuta resize.
3. **localStorage > 5MB**: alertas, attendance, confirmations, sugestões e cupons compartilham origem. Adicionar TTL/cap em `useAlerts` e `useSuggestedVenues` quando passar de ~50 entradas.
4. `**liveConfirmations` no schema vs hook**: o campo no `Venue` está em `0` e o número exibido vem do hook (seed + delta). Se um dia vierem do backend, padronizar fonte única.
5. **Hydration mismatch**: hooks que leem `localStorage` no `useState` inicial podem divergir entre SSR/client. Hoje `use-local-storage.ts` faz `typeof window === 'undefined' → fallback`, mas se um componente renderizar valor do storage no primeiro paint, vai diferir. Idealmente usar `useHydrated()` ou efeito de pós-mount para revelar dados sensíveis ao localStorage.
6. **CartoDB tile policy**: uso pesado pode exigir API key. Para produção, considerar self-host ou outro provedor.
7. **SEO do mapa lazy**: como o mapa só monta no client, crawlers não veem os pinos. Sem impacto direto (mapa não é conteúdo indexável), mas a lista de bares deve continuar SSR.
8. **Sugestões só locais**: hoje vivem no localStorage do device — outro usuário não vê. Próximo passo natural é Lovable Cloud para persistir.

# CORREÇÃO CRÍTICA & AUDITORIA MATCHMAP v2

Vamos resolver o crash de inicialização (Error Boundary) e consolidar todas as funcionalidades da v2. Siga estas instruções técnicas rigorosamente:

### 1. FIX DE CRASH (SSR & RUNTIME)

- Em 'src/routes/index.tsx': Remova a importação estática do 'VenueMap'. Substitua por um import dinâmico usando 'React.lazy' para garantir que o Leaflet carregue apenas no lado do cliente (client-side). 

- Envolva as instâncias do '<VenueMap />' (Desktop e Mobile) em um '<Suspense>' com um fallback de skeleton (ex: 'bg-slate-900 animate-pulse').

- No componente 'FlyTo' dentro de 'VenueMap.tsx', adicione uma proteção: verifique se 'map.getSize().x > 0' e se as coordenadas são válidas antes de disparar o 'flyTo'. Chame 'map.invalidateSize()' antes da transição para garantir que o container esteja dimensionado.

### 2. EXPANSÃO DA BASE DE DADOS (6 Bares)

Atualize o 'src/data/venues.ts' para conter 6 bares fixos em Joinville com dados reais de domingo (10/05/2026). Adicione:

- 'Opa Bierhaus' (Saguaçu): Foco em Chopp, transmitindo Inter x Bahia e Flu x Vasco.

- 'Boteco da Ilha' (Santo Antônio): Vibe caldeirão, transmitindo Champions (Bayern x PSG) e Brasileirão.

- 'Pizzaria Anita' (Anita Garibaldi): Vibe família, climatizada, com cupom 'Rodízio Infantil Grátis'.

- Mantenha os 3 bares anteriores (Gigante, Arena e Família & Futebol) atualizados com o novo schema de 'matches' e 'whatsapp'.

### 3. AUDITORIA DE FUNCIONALIDADES v2

Certifique-se de que TODOS os módulos abaixo estão ativos e integrados:

- [UX MOBILE]: Drawer arrastável (vaul) substituindo abas no mobile.

- [MONETIZAÇÃO]: Cupons com countdown, botões de Reserva/Rota/Uber e banners de 'Reivindicar Perfil'.

- [CONFIABILIDADE]: Status 'AO VIVO' pulsante, selos de cobertura de streaming (Premiere, etc.) e data da última verificação.

- [WAZE-ALERTS]: Relato de problemas (Sem TV, Lotado) com alteração de ícone no mapa (Pino Amber/Red) e banner de alertas no sheet.

- [GROWTH]: 'Perto de mim' com ordenação por KM (Haversine), Enquete de Torcida e Contador 'Quem vai' (localStorage).

- [RADAR]: Botão 'Indicar lugar' que injeta o bar temporário na lista com tarja 'Em Análise'.

Se algum desses itens estiver faltando ou tiver sido sobrescrito, re-implemente-o agora usando os hooks e componentes modulares que definimos.