import { ALL_COMPETITIONS, type Competition } from "@/data/venues";
import { cn } from "@/lib/utils";

interface Props {
  active: Set<Competition>;
  onToggle: (c: Competition) => void;
}

export function CompetitionChips({ active, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Competição
      </span>
      <div className="flex flex-wrap gap-2">
        {ALL_COMPETITIONS.map((c) => {
          const on = active.has(c);
          return (
            <button
              key={c}
              onClick={() => onToggle(c)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                on
                  ? "border-highlight bg-highlight text-highlight-foreground"
                  : "border-border bg-surface text-foreground/80 hover:border-highlight/50",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
