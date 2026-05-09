import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  attending: boolean;
  onToggle: () => void;
}

export function AttendanceButton({ count, attending, onToggle }: Props) {
  return (
    <Button
      onClick={onToggle}
      variant={attending ? "default" : "secondary"}
      className={cn(
        "w-full gap-2",
        attending && "bg-[var(--gradient-flame)] text-highlight-foreground hover:opacity-90",
      )}
    >
      <Flame className="h-4 w-4" />
      {attending ? `Você + ${count - 1} confirmados` : `🔥 ${count} vão · Vou também`}
    </Button>
  );
}
