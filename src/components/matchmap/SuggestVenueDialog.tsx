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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_COMPETITIONS,
  JOINVILLE_NEIGHBORHOODS,
  type Competition,
} from "@/data/venues";
import { suggestVenueSchema } from "@/lib/validation-schemas";
import type { SuggestVenueInput } from "@/lib/validation-schemas";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (input: SuggestVenueInput) => void;
}

export function SuggestVenueDialog({ open, onOpenChange, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [comps, setComps] = useState<Set<Competition>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (c: Competition) =>
    setComps((p) => {
      const n = new Set(p);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = suggestVenueSchema.safeParse({
      name,
      neighborhood,
      competitions: Array.from(comps),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path.join(".")] = i.message));
      setErrors(errs);
      return;
    }
    onSubmit(parsed.data);
    toast.success("Indicação recebida!", {
      description: "O local entrará no radar da comunidade. Vamos verificar em breve.",
    });
    setName("");
    setNeighborhood("");
    setComps(new Set());
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Indicar um lugar</DialogTitle>
          <DialogDescription>
            Conhece um bar ou restaurante que transmite jogos? Coloca no radar da comunidade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label>Nome do local</Label>
            <Input value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label>Bairro em Joinville</Label>
            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {JOINVILLE_NEIGHBORHOODS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.neighborhood && (
              <p className="text-xs text-destructive">{errors.neighborhood}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Competições que costuma transmitir</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_COMPETITIONS.map((c) => {
                const on = comps.has(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(c)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {errors.competitions && (
              <p className="text-xs text-destructive">{errors.competitions}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[var(--gradient-pitch)] text-primary-foreground hover:opacity-90">
              Enviar indicação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
