## MatchMap — Dashboard "Onde Assistir Jogos"

Aplicação web responsiva, dark mode esportivo, conectando torcedores a bares que transmitem jogos em Joinville/SC.

### Stack & bibliotecas

- React + TanStack Start (já configurado)
- Tailwind v4 + shadcn/ui (já no projeto)
- `lucide-react` (já instalado)
- `framer-motion` (instalar) — animações de cards/modais
- `react-leaflet` + `leaflet` (instalar) — mapa interativo dark
- Mock data local (sem backend nesta primeira versão)

### Design system (src/styles.css)

- Fundo base slate `#0f172a`, superfícies `#1e293b`, bordas sutis
- Acento principal **verde-esmeralda** (`emerald`) + acento secundário **laranja** para destaques de jogos
- Tipografia Inter via Google Fonts
- Tokens semânticos: `--accent`, `--accent-glow`, `--surface`, `--surface-elevated`, gradientes esportivos e sombras com glow esmeralda

### Estrutura de arquivos

```
src/
  routes/
    index.tsx                  # Dashboard principal
  components/
    matchmap/
      Header.tsx               # Logo + cidade + busca + "Cadastrar meu Bar"
      FilterChips.tsx          # Chips de comodidades
      VenueCard.tsx            # Card de bar
      VenueList.tsx            # Lista rolável
      VenueDetailsSheet.tsx    # Sheet lateral com detalhes
      VenueMap.tsx             # React Leaflet, tema dark, marcadores custom
      VenuePopup.tsx           # Popup do pino
      RegisterBarDialog.tsx    # Formulário de cadastro
      MobileTabs.tsx           # Alternância Lista/Mapa no mobile
  data/
    venues.ts                  # Mock dos 3 bares + tipos
  hooks/
    use-venue-filters.ts       # Estado dos filtros + venue selecionado
```

### Layout

- **Desktop:** grid 40/60 — sidebar esquerda (header de filtros + lista rolável) | mapa à direita ocupando viewport
- **Mobile:** Tabs shadcn "Lista" / "Mapa" no topo, ocupando tela inteira
- Header fixo no topo em todas as resoluções

### Funcionalidades

1. **Filtros (chips toggle):** Open Bar, Espaço Kids, Telão LED, Música Ao Vivo, Promoção de Petiscos. Lógica AND — bar só aparece se possuir todas as tags selecionadas. Filtra simultaneamente lista **e** marcadores do mapa.
2. **Busca:** input no header filtra por nome do bar ou nome do jogo/time.
3. **Card → Mapa:** clicar num card centraliza o mapa (`map.flyTo`) no bar e abre o Sheet de detalhes.
4. **Pino → Popup:** mostra nome, jogo em destaque e botão "Ver Detalhes" que abre o Sheet.
5. **Sheet de detalhes:** foto, nota, endereço completo, horário, entrada, contato/reserva, lista de comodidades com ícones, jogo do dia.
6. **Cadastrar meu Bar:** Dialog com formulário (nome, endereço, contato, comodidades) — apenas frontend, mostra toast de confirmação.
7. **Animações:** `framer-motion` `AnimatePresence` para entrada/saída de cards ao filtrar, fade no Sheet, hover scale nos cards.

### Mock data

Os 3 bares fornecidos (Bar do Gigante, Arena Sports Pub, Família & Futebol Espetaria) com coordenadas, jogo, comodidades, nota, entrada, mais campos preenchidos com valores plausíveis (foto via Unsplash, horário, telefone fictício).

### Mapa

- React Leaflet com tile layer **CartoDB Dark Matter** (gratuito, combina com tema)
- Marcadores customizados em SVG (pino esmeralda com ícone de cerveja/bola)
- `MapContainer` com ref para `flyTo` quando card é clicado
- Cluster não necessário (poucos bares)

### SEO

- Title: "MatchMap — Onde assistir jogos em Joinville"
- Meta description com keywords (bares, transmissão, futebol, Joinville)
- H1 único no header

### Fora de escopo (esta versão)

- Backend / persistência (cadastros não salvam)
- Autenticação
- Múltiplas cidades funcionais (seletor é visual)

### ⚠️ Único Ponto de Atenção Técnica (Apenas para Ciência)

- **Filtros com Lógica AND:** Como definimos que um bar só aparece se possuir **todas** as tags clicadas, se o usuário ativar "Open Bar", "Espaço Kids" e "Telão LED" ao mesmo tempo, é muito provável que a lista retorne vazia (já que é raro um local ter exatamente todas essas características simultaneamente). Isso está tecnicamente correto e é ótimo para buscas precisas, mas vale ter em mente para a experiência do usuário final.