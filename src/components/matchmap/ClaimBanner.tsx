import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function ClaimBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="rounded-lg border-l-4 border-primary bg-slate-900 p-3">
      <div className="flex items-start gap-3">
        <Crown className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-semibold">É dono deste bar?</p>
          <p className="text-xs text-muted-foreground">
            Reivindique o perfil para responder alertas e atualizar seu status ao vivo.
          </p>
          <Button size="sm" className="mt-2" onClick={onOpen}>
            Reivindicar perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
