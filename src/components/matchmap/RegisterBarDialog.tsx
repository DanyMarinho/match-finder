import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ALL_AMENITIES, AMENITY_META, type Amenity } from "@/data/venues";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function RegisterBarDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [amenities, setAmenities] = useState<Set<Amenity>>(new Set());

  const toggle = (a: Amenity) =>
    setAmenities((p) => {
      const n = new Set(p);
      n.has(a) ? n.delete(a) : n.add(a);
      return n;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;
    toast.success("Cadastro enviado!", {
      description: `${name} entrará em análise nas próximas 24h.`,
    });
    setName("");
    setAddress("");
    setPhone("");
    setNotes("");
    setAmenities(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar meu bar</DialogTitle>
          <DialogDescription>
            Coloque seu estabelecimento no mapa dos torcedores.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bar-name">Nome do bar</Label>
            <Input
              id="bar-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bar-addr">Endereço</Label>
            <Input
              id="bar-addr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bar-phone">Telefone para reservas</Label>
            <Input id="bar-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Comodidades</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_AMENITIES.map((a) => {
                const on = amenities.has(a);
                return (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggle(a)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    {AMENITY_META[a].emoji} {a}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bar-notes">Observações</Label>
            <Textarea
              id="bar-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[var(--gradient-pitch)] font-semibold text-primary-foreground hover:opacity-90"
            >
              Enviar cadastro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
