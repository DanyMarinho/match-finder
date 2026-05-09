import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { claimBarSchema } from "@/lib/validation-schemas";
import { useClaimIntents } from "@/hooks/use-claim-intents";
import type { Venue } from "@/data/venues";
import { toast } from "sonner";

interface Props {
  venue: Venue;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const PLANS = [
  { id: "basic", label: "Básico (grátis)", desc: "Atualizar status e responder alertas" },
  { id: "premium", label: "Premium · R$ 99/mês", desc: "Destaque na lista + cupons" },
  { id: "destaque", label: "Destaque · R$ 249/mês", desc: "Topo da busca + analytics" },
] as const;

export function ClaimBarDialog({ venue, open, onOpenChange }: Props) {
  const { submit } = useClaimIntents();
  const [ownerName, setOwnerName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<"basic" | "premium" | "destaque">("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = claimBarSchema.safeParse({ ownerName, document, phone, plan });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path.join(".")] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    submit(venue.id, parsed.data);
    toast.success("Solicitação enviada!", {
      description: "Em breve nosso time entra em contato para validar.",
    });
    setOwnerName("");
    setDocument("");
    setPhone("");
    setPlan("basic");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reivindicar {venue.name}</DialogTitle>
          <DialogDescription>
            Preencha para liberar o painel do dono e gerenciar este bar no MatchMap.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Nome do dono</Label>
            <Input value={ownerName} maxLength={100} onChange={(e) => setOwnerName(e.target.value)} />
            {errors.ownerName && <p className="text-xs text-destructive">{errors.ownerName}</p>}
          </div>
          <div className="space-y-1">
            <Label>CNPJ ou CPF</Label>
            <Input value={document} maxLength={18} onChange={(e) => setDocument(e.target.value)} />
            {errors.document && <p className="text-xs text-destructive">{errors.document}</p>}
          </div>
          <div className="space-y-1">
            <Label>Telefone</Label>
            <Input value={phone} maxLength={20} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label>Plano</Label>
            <RadioGroup value={plan} onValueChange={(v) => setPlan(v as typeof plan)}>
              {PLANS.map((p) => (
                <label
                  key={p.id}
                  htmlFor={`plan-${p.id}`}
                  className="flex cursor-pointer items-start gap-2 rounded-md border border-border bg-surface px-3 py-2 hover:border-primary/40"
                >
                  <RadioGroupItem value={p.id} id={`plan-${p.id}`} className="mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[var(--gradient-pitch)] text-primary-foreground hover:opacity-90">
              Enviar solicitação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
