import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Venue, ActiveAlert } from "@/data/venues";
import { toast } from "sonner";

export function useVenues() {
  const queryClient = useQueryClient();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      // Transform back to Venue type
      return data.map((v: any) => ({
        ...v,
        coords: v.coords as [number, number],
        broadcastPackages: v.broadcast_packages,
        lastVerified: v.last_verified,
        operationalStatus: v.operational_status,
        activeAlerts: [], // We'll fetch alerts separately or join
      })) as Venue[];
    },
  });

  // Real-time sync
  useEffect(() => {
    const channel = supabase
      .channel("venues_realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "venues",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          // Invalidate query to refetch or manually update cache
          queryClient.setQueryData(["venues"], (old: Venue[] | undefined) => {
            if (!old) return old;
            return old.map(v => v.id === payload.new.id ? {
              ...v,
              liveConfirmations: payload.new.live_confirmations,
              operationalStatus: payload.new.operational_status,
            } : v);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const checkInMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error } = await supabase.rpc("increment_live_confirmations", {
        venue_id: venueId,
      });
      if (error) throw error;
      
      await supabase.from("check_ins").insert({ venue_id: venueId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      toast.success("Presença confirmada!");
    },
    onError: (err: any) => {
      toast.error("Erro ao confirmar presença: " + err.message);
    },
  });

  return {
    venues,
    isLoading,
    checkIn: checkInMutation.mutate,
  };
}
