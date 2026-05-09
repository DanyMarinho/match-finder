import type { OperationalStatus } from "@/data/venues";

const META: Record<
  Exclude<OperationalStatus, "open">,
  { label: string; bg: string; text: string }
> = {
  maintenance: {
    label: "🔧 Em manutenção / reformas",
    bg: "bg-amber-500",
    text: "text-amber-950",
  },
  closed_today: {
    label: "🚫 Fechado hoje",
    bg: "bg-red-500",
    text: "text-red-950",
  },
  full: {
    label: "🔥 Casa cheia — sem mesas",
    bg: "bg-orange-500",
    text: "text-orange-950",
  },
};

export function StatusOverlay({ status }: { status: OperationalStatus }) {
  if (status === "open") return null;
  const meta = META[status];
  return (
    <div
      className={`flex w-full items-center justify-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text}`}
    >
      {meta.label}
    </div>
  );
}
