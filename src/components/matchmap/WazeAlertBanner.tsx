import { ALERT_LABELS } from "@/hooks/use-alerts";
import type { ActiveAlert } from "@/data/venues";
import { Button } from "@/components/ui/button";
import { ThumbsUp, TriangleAlert } from "lucide-react";

interface Props {
  alerts: ActiveAlert[];
  onConfirm: (alertId: string) => void;
}

function timeAgo(iso: string) {
  const min = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return min < 60 ? `há ${min} min` : `há ${Math.round(min / 60)} h`;
}

export function WazeAlertBanner({ alerts, onConfirm }: Props) {
  if (alerts.length === 0) return null;
  return (
    <div className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
      <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
        <TriangleAlert className="h-4 w-4" /> Alertas da comunidade
      </div>
      <ul className="space-y-1.5">
        {alerts.map((a) => {
          const meta = ALERT_LABELS[a.type];
          return (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-md bg-amber-500/5 px-2 py-1.5 text-sm"
            >
              <div className="min-w-0">
                <span className="font-semibold">
                  {meta.emoji} {meta.label}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {timeAgo(a.reportedAt)} · {a.votes} {a.votes === 1 ? "voto" : "votos"}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => onConfirm(a.id)}
              >
                <ThumbsUp className="mr-1 h-3 w-3" /> confirmar
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
