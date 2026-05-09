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
    <Button
      onClick={onConfirm}
      className={cn(
        "w-full justify-center gap-2 font-semibold",
        confirmed
          ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
          : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25",
      )}
    >
      <CheckCheck className="h-4 w-4" />
      {confirmed
        ? `Você confirmou — ${count} torcedores ao vivo`
        : count > 0
          ? `Sinal confirmado por ${count} · Confirme você também`
          : "Confirmar que está passando agora"}
    </Button>
  );
}
