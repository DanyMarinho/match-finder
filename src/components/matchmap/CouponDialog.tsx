import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Venue } from "@/data/venues";
import { useCoupons } from "@/hooks/use-coupons";
import { Copy, Ticket } from "lucide-react";
import { toast } from "sonner";

interface Props {
  venue: Venue;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Expirado";
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h${min.toString().padStart(2, "0")}min`;
}

export function CouponDialog({ venue, open, onOpenChange }: Props) {
  const { redeem, redeemedAt } = useCoupons();
  const coupon = venue.coupon;
  const redeemed = redeemedAt(venue.id);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [open]);

  if (!coupon) return null;
  const expiresAt = redeemed
    ? new Date(redeemed).getTime() + coupon.expiresInHours * 3600 * 1000
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-highlight" /> {coupon.label}
          </DialogTitle>
          <DialogDescription>{venue.name}</DialogDescription>
        </DialogHeader>
        {!redeemed ? (
          <Button
            onClick={() => {
              redeem(venue.id);
              toast.success("Cupom resgatado! Mostre o código ao garçom.");
            }}
            className="bg-[var(--gradient-flame)] text-highlight-foreground hover:opacity-90"
          >
            Resgatar cupom
          </Button>
        ) : (
          <div className="space-y-3 text-center">
            <div className="rounded-xl border-2 border-dashed border-highlight bg-highlight/10 p-5">
              <p className="font-mono text-3xl font-extrabold tracking-widest text-highlight">
                {coupon.code}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Válido por mais{" "}
              <span className="font-semibold text-foreground">
                {formatRemaining(expiresAt - now)}
              </span>
            </p>
            <Button
              variant="secondary"
              className="w-full gap-2"
              onClick={() => {
                navigator.clipboard.writeText(coupon.code);
                toast("Código copiado");
              }}
            >
              <Copy className="h-4 w-4" /> Copiar código
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
