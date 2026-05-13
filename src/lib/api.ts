import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const submitCheckIn = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const venueId = ctx.data as string;
    const { error } = await supabase.rpc('increment_live_confirmations', { venue_id: venueId });
    if (error) {
      const { data: venue } = await supabase.from('venues').select('live_confirmations').eq('id', venueId).single();
      await supabase.from('venues').update({ 
        live_confirmations: (venue?.live_confirmations || 0) + 1 
      }).eq('id', venueId);
    }
    await supabase.from('check_ins').insert({ venue_id: venueId });
    return { success: true };
  });

export const reportAlert = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as { venueId: string; type: string };
    await supabase.from('alerts').insert({
      venue_id: data.venueId,
      type: data.type
    });
    return { success: true };
  });

export const registerVenue = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as { name: string; address: string; phone?: string; amenities?: string[]; notes?: string };
    await supabase.from('registrations').insert({
      name: data.name,
      address: data.address,
      phone: data.phone,
      amenities: data.amenities || [],
      notes: data.notes
    });
    return { success: true };
  });
