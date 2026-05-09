import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  count: number;
  children: ReactNode;
}

export function MobileDrawer({ count, children }: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="absolute bottom-4 left-1/2 z-[400] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface-elevated px-5 py-2.5 text-sm font-semibold shadow-lg backdrop-blur">
          <ChevronUp className="h-4 w-4 text-primary" />
          {count} {count === 1 ? "bar" : "bares"} hoje
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[88vh]">
        <div className="flex h-full max-h-[80vh] flex-col">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
