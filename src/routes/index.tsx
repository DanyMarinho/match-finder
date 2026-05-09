import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/matchmap/Header";
import { FilterChips } from "@/components/matchmap/FilterChips";
import { VenueList } from "@/components/matchmap/VenueList";
import { VenueDetailsSheet } from "@/components/matchmap/VenueDetailsSheet";
import { VenueMap } from "@/components/matchmap/VenueMap";
import { RegisterBarDialog } from "@/components/matchmap/RegisterBarDialog";
import { useVenueFilters } from "@/hooks/use-venue-filters";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleSelect = (id: string) => {
    f.setSelectedId(id);
    setSheetOpen(true);
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Header query={f.query} onQuery={f.setQuery} onRegister={() => setRegisterOpen(true)} />

      {/* Desktop split */}
      <div className="hidden flex-1 overflow-hidden md:flex">
        <aside className="flex w-2/5 max-w-[480px] flex-col border-r border-border bg-sidebar">
          <div className="border-b border-border p-4">
            <FilterChips active={f.active} onToggle={f.toggle} onClear={f.clear} />
          </div>
          <VenueList
            venues={f.filtered}
            selectedId={f.selectedId}
            onSelect={handleSelect}
          />
        </aside>
        <main className="relative flex-1">
          <VenueMap venues={f.filtered} selected={f.selected} onSelect={handleSelect} />
        </main>
      </div>

      {/* Mobile tabs */}
      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        <div className="border-b border-border p-3">
          <FilterChips active={f.active} onToggle={f.toggle} onClear={f.clear} />
        </div>
        <Tabs defaultValue="list" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="mx-3 mt-3 grid grid-cols-2">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="flex-1 overflow-hidden">
            <VenueList
              venues={f.filtered}
              selectedId={f.selectedId}
              onSelect={handleSelect}
            />
          </TabsContent>
          <TabsContent value="map" className="flex-1 overflow-hidden">
            <VenueMap venues={f.filtered} selected={f.selected} onSelect={handleSelect} />
          </TabsContent>
        </Tabs>
      </div>

      <VenueDetailsSheet venue={f.selected} open={sheetOpen} onOpenChange={setSheetOpen} />
      <RegisterBarDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <Toaster />
    </div>
  );
}
