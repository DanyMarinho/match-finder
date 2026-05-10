import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/matchmap/Header";
import { FilterChips } from "@/components/matchmap/FilterChips";
import { CompetitionChips } from "@/components/matchmap/CompetitionChips";
import { VenueList } from "@/components/matchmap/VenueList";
import { VenueDetailsSheet } from "@/components/matchmap/VenueDetailsSheet";

// Leaflet acessa `window` em escopo de módulo — carregar somente no client.
const VenueMap = lazy(() =>
  import("@/components/matchmap/VenueMap").then((m) => ({ default: m.VenueMap })),
);

const MapFallback = () => (
  <div className="flex h-full w-full animate-pulse items-center justify-center bg-slate-900 text-sm text-slate-400">
    Carregando mapa…
  </div>
);
import { RegisterBarDialog } from "@/components/matchmap/RegisterBarDialog";
import { SuggestVenueDialog } from "@/components/matchmap/SuggestVenueDialog";
import { MobileDrawer } from "@/components/matchmap/MobileDrawer";
import { useVenueFilters } from "@/hooks/use-venue-filters";
import { useAttendance } from "@/hooks/use-attendance";
import { useLiveConfirmations } from "@/hooks/use-live-confirmations";
import { useAlerts } from "@/hooks/use-alerts";
import { useUserLocation } from "@/hooks/use-user-location";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { VENUES } from "@/data/venues";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "MatchMap — Onde assistir jogos em Joinville" },
      {
        name: "description",
        content:
          "Encontre bares e eventos em Joinville/SC para assistir os jogos. Filtre por telão, open bar, espaço kids e mais.",
      },
      { property: "og:title", content: "MatchMap — Onde assistir jogos" },
      {
        property: "og:description",
        content: "Conecte-se a bares e eventos de transmissão de partidas perto de você.",
      },
    ],
  }),
});

function Dashboard() {
  const f = useVenueFilters();
  const attendance = useAttendance();
  const live = useLiveConfirmations();

  // Seed alerts from venue data (only for source venues, not user-suggested).
  const seedAlerts: Record<string, typeof VENUES[number]["activeAlerts"]> = {};
  VENUES.forEach((v) => {
    if (v.activeAlerts.length > 0) seedAlerts[v.id] = v.activeAlerts;
  });
  const { alertsFor, report, confirmAlert } = useAlerts(seedAlerts);

  const userLoc = useUserLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  // Sync user coords to filters
  useEffect(() => {
    if (userLoc.state.status === "ready") {
      f.setUserCoords(userLoc.state.coords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoc.state]);

  // Deep link ?bar=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("bar");
    if (id) {
      f.setSelectedId(id);
      setSheetOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string) => {
    f.setSelectedId(id);
    setSheetOpen(true);
  };

  const handleLocate = () => {
    userLoc.request();
  };

  const handleNearMe = () => {
    if (userLoc.state.status !== "ready") userLoc.request();
    f.setSortByDistance(!f.sortByDistance);
  };

  const alertsCountFor = (id: string) => alertsFor(id).length;
  const hasCriticalAlert = (id: string) =>
    alertsFor(id).some((a) => a.type === "closed");

  const filtersBlock = (
    <div className="space-y-4">
      <FilterChips active={f.active} onToggle={f.toggle} onClear={f.clear} />
      <CompetitionChips active={f.competitions} onToggle={f.toggleCompetition} />
      <Button
        variant={f.sortByDistance ? "default" : "secondary"}
        size="sm"
        onClick={handleNearMe}
        className="w-full gap-2"
      >
        <Navigation className="h-4 w-4" />
        {f.sortByDistance ? "Ordenado por distância" : "Perto de mim"}
      </Button>
    </div>
  );

  const listBlock = (
    <VenueList
      venues={f.filtered}
      selectedId={f.selectedId}
      onSelect={handleSelect}
      onHover={f.setHoveredId}
      onClear={f.clear}
      onSuggest={() => setSuggestOpen(true)}
      attendanceFor={attendance.countFor}
      liveConfirmationsFor={live.countFor}
      alertsCountFor={alertsCountFor}
      distanceFor={f.distanceTo}
    />
  );

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Header
        query={f.query}
        onQuery={f.setQuery}
        onRegister={() => setRegisterOpen(true)}
        onSuggest={() => setSuggestOpen(true)}
      />

      {/* Desktop split */}
      <div className="hidden flex-1 overflow-hidden md:flex">
        <aside className="flex w-2/5 max-w-[480px] flex-col border-r border-border bg-sidebar">
          <div className="border-b border-border p-4">{filtersBlock}</div>
          {listBlock}
        </aside>
        <main className="relative flex-1">
          <Suspense fallback={<MapFallback />}>
            <VenueMap
              venues={f.filtered}
              selected={f.selected}
              hoveredId={f.hoveredId}
              onSelect={handleSelect}
              onHover={f.setHoveredId}
              alertsCountFor={alertsCountFor}
              hasCriticalAlert={hasCriticalAlert}
              userCoords={f.userCoords}
              onLocate={handleLocate}
            />
          </Suspense>
        </main>
      </div>

      {/* Mobile: fullscreen map + bottom drawer */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:hidden">
        <Suspense fallback={<MapFallback />}>
          <VenueMap
            venues={f.filtered}
            selected={f.selected}
            hoveredId={f.hoveredId}
            onSelect={handleSelect}
            onHover={f.setHoveredId}
            alertsCountFor={alertsCountFor}
            hasCriticalAlert={hasCriticalAlert}
            userCoords={f.userCoords}
            onLocate={handleLocate}
          />
        </Suspense>
        <MobileDrawer count={f.filtered.length}>
          <div className="border-b border-border p-4">{filtersBlock}</div>
          {listBlock}
        </MobileDrawer>
      </div>

      <VenueDetailsSheet
        venue={f.selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        alerts={f.selected ? alertsFor(f.selected.id) : []}
        onReport={report}
        onConfirmAlert={confirmAlert}
      />
      <RegisterBarDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <SuggestVenueDialog
        open={suggestOpen}
        onOpenChange={setSuggestOpen}
        onSubmit={f.submitSuggestion}
      />
      <Toaster />
    </div>
  );
}
