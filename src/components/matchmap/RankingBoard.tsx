import { type Venue } from "@/data/venues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Flame, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Props {
  venues: Venue[];
  onSelect: (id: string) => void;
}

export function RankingBoard({ venues, onSelect }: Props) {
  const ranked = [...venues]
    .sort((a, b) => b.liveConfirmations - a.liveConfirmations)
    .slice(0, 10);

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter">
            <Trophy className="h-3 w-3" />
            Ranking de Torcidas
          </div>
          <h2 className="text-xl font-black italic">ONDE O CLIMA TÁ PEGANDO FOGO</h2>
        </div>

        <div className="grid gap-3">
          {ranked.map((v, i) => (
            <Card 
              key={v.id} 
              className={cn(
                "bg-slate-900/50 border-slate-800 transition-all hover:border-primary/50 cursor-pointer group",
                i === 0 && "border-primary/40 bg-primary/5"
              )}
              onClick={() => onSelect(v.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  i === 0 ? "bg-primary text-primary-foreground" : 
                  i === 1 ? "bg-slate-400 text-slate-950" :
                  i === 2 ? "bg-amber-700 text-amber-50" : "bg-slate-800 text-slate-400"
                )}>
                  {i + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-100 truncate group-hover:text-primary transition-colors">
                    {v.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="truncate">{v.neighborhood}</span>
                    {v.liveConfirmations > 5 && (
                      <Badge variant="outline" className="h-4 border-amber-500/50 text-amber-500 bg-amber-500/5 text-[9px] px-1 py-0 font-bold uppercase">
                        <Flame className="h-2 w-2 mr-0.5 fill-amber-500" /> Bombando
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 font-black text-primary italic">
                    <Users className="h-3 w-3" />
                    {v.liveConfirmations}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Torcedores</div>
                </div>
                
                <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-xs text-slate-400 mb-2">Quer seu bar aqui no topo?</p>
          <p className="text-sm font-bold text-slate-100">Peça para os clientes darem check-in ao chegar!</p>
        </div>
      </div>
    </ScrollArea>
  );
}
