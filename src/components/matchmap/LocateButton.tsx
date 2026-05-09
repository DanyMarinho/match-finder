import { Locate } from "lucide-react";

export function LocateButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Minha localização"
      className="absolute right-3 top-3 z-[400] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg transition hover:bg-primary hover:text-primary-foreground"
    >
      <Locate className="h-5 w-5" />
    </button>
  );
}
