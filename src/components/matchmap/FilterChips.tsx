import { ALL_AMENITIES, AMENITY_META, type Amenity } from "@/data/venues";
import { cn } from "@/lib/utils";
import { X, Flame } from "lucide-react";

interface Props {
  active: Set<Amenity>;
  onToggle: (a: Amenity) => void;
  onClear: () => void;
}

export function FilterChips({ active, onToggle, onClear }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filtros
        </span>
        {active.size > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> limpar
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onToggle("🔥 BOMBANDO" as any)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
            active.has("🔥 BOMBANDO" as any)
              ? "border-amber-500 bg-amber-500 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              : "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:border-amber-500/60",
          )}
        >
          <Flame className={cn("h-3 w-3", active.has("🔥 BOMBANDO" as any) ? "fill-amber-950" : "fill-amber-500")} />
          BOMBANDO
        </button>

        {ALL_AMENITIES.map((a) => {
          const isOn = active.has(a);
          const meta = AMENITY_META[a];
          return (
            <button
              key={a}
              onClick={() => onToggle(a)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                isOn
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border-border bg-surface text-foreground/80 hover:border-primary/40 hover:text-foreground",
              )}
            >
              <span>{meta.emoji}</span>
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
