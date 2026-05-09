import { cn } from "@/lib/utils";

interface Props {
  label?: string;
  className?: string;
  tone?: "live" | "muted";
}

/**
 * AO VIVO badge — Tailwind v4 friendly (dot + ping ring).
 * Use `tone="muted"` for ended matches.
 */
export function LiveBadge({ label = "AO VIVO", className, tone = "live" }: Props) {
  const isLive = tone === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        isLive
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            isLive ? "bg-emerald-500" : "bg-muted-foreground",
          )}
        />
      </span>
      {label}
    </span>
  );
}
