import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
