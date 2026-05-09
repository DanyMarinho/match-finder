export function formatVerified(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffMin = Math.round((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "agora há pouco";
  if (diffMin < 60) return `há ${diffMin} min`;
  const isSameDay = date.toDateString() === now.toDateString();
  if (isSameDay) {
    return `hoje às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
