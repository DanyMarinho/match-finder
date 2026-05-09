import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  confirmed: boolean;
  onConfirm: () => void;
}

export function LiveConfirmButton({ count, confirmed, onConfirm }: Props) {
  return (
    <div className="space-y-2">
      <Button
        onClick={onConfirm}
        disabled={confirmed}
        className={cn(
          "w-full justify-center gap-2 font-semibold transition-all",
          confirmed
            ? "cursor-not-allowed bg-slate-800 text-slate-400 opacity-90 hover:bg-slate-800"
            : "bg-emerald-600 text-white hover:bg-emerald-500",
        )}
      >
        <CheckCheck className="h-4 w-4" />
        {confirmed
          ? "✅ Você já confirmou este sinal hoje"
          : "✅ Confirmar que está passando agora"}
      </Button>
      {count > 0 && (
        <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <CheckCheck className="h-3.5 w-3.5" />
          Sinal confirmado por {count} torcedor{count > 1 ? "es" : ""} agora
        </div>
      )}
    </div>
  );
}
