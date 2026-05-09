import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import type { Venue } from "@/data/venues";
import { nativeShare, whatsappLink } from "@/lib/share";

export function ShareButton({ venue }: { venue: Venue }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/?bar=${venue.id}`
      : `https://matchmap.app/?bar=${venue.id}`;
  const next = venue.matches[0];
  const matchTxt = next ? `${next.home} × ${next.away}` : "o jogo";
  const text = `🍻 Bora ver ${matchTxt} no ${venue.name} hoje? ${url}`;

  const onClick = async () => {
    const shared = await nativeShare(venue.name, text, url);
    if (!shared) window.open(whatsappLink(undefined, text), "_blank");
  };

  return (
    <Button variant="secondary" onClick={onClick} className="gap-2">
      <Share2 className="h-4 w-4" />
      Chamar a galera
    </Button>
  );
}
