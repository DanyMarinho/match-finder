import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Venue } from "@/data/venues";
import { toast } from "sonner";

export function useVenues() {
  const queryClient = useQueryClient();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      console.log("[useVenues] Fetching venues...");
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      return (data || []).map((v: any) => ({
        ...v,
        coords: v.coords as [number, number],
        broadcastPackages: v.broadcast_packages || [],
        lastVerified: v.last_verified,
        operationalStatus: v.operational_status,
        activeAlerts: [], 
      })) as Venue[];
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const channel = supabase
      .channel(`v_${Math.random().toString(36).slice(2, 7)}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "venues",
        },
        (payload) => {
          queryClient.setQueryData(["venues"], (old: Venue[] | undefined) => {
            if (!old) return old;
            return old.map(v => v.id === payload.new.id ? {
              ...v,
              liveConfirmations: payload.new.live_confirmations,
              operationalStatus: payload.new.operational_status,
              matches: payload.new.matches,
            } : v);
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  const checkInMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error: rpcError } = await supabase.rpc("increment_live_confirmations", {
        venue_id: venueId,
      });
      
      if (rpcError) {
        const { data: current } = await supabase.from("venues").select("live_confirmations").eq("id", venueId).single();
        await supabase.from("venues").update({ live_confirmations: (current?.live_confirmations || 0) + 1 }).eq("id", venueId);
      }
      
      await supabase.from("check_ins").insert({ venue_id: venueId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      toast.success("Sinal confirmado com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao confirmar presença: " + err.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("registrations").insert({
        name: data.name,
        address: data.address,
        phone: data.phone,
        amenities: Array.from(data.amenities || []),
        notes: data.notes
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cadastro enviado!", {
        description: "Seu bar entrará em análise nas próximas 24h.",
      });
    },
    onError: (err: any) => {
      toast.error("Erro ao enviar cadastro: " + err.message);
    },
  });

  return {
    venues,
    isLoading,
    checkIn: checkInMutation.mutate,
    register: registerMutation.mutate,
  };
}
