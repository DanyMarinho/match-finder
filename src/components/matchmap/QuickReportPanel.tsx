import type { AlertType } from "@/data/venues";
import { ALERT_LABELS } from "@/hooks/use-alerts";

const TYPES: AlertType[] = ["no_tv", "no_sub", "full", "closed"];

interface Props {
  onReport: (type: AlertType) => void;
}

export function QuickReportPanel({ onReport }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Relatar status (Waze)
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TYPES.map((t) => {
          const meta = ALERT_LABELS[t];
          return (
            <button
              key={t}
              onClick={() => onReport(t)}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:border-amber-500/60 hover:bg-amber-500/10"
            >
              <span className="text-lg">{meta.emoji}</span>
              <span className="truncate text-left">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
