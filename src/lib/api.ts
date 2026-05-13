import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const submitCheckIn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async ({ data: venueId }) => {
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
  .validator(z.object({ venueId: z.string(), type: z.string() }))
  .handler(async ({ data }) => {
    await supabase.from('alerts').insert({
      venue_id: data.venueId,
      type: data.type
    });
    return { success: true };
  });

export const registerVenue = createServerFn({ method: "POST" })
  .validator(z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    notes: z.string().optional()
  }))
  .handler(async ({ data }) => {
    await supabase.from('registrations').insert({
      name: data.name,
      address: data.address,
      phone: data.phone,
      amenities: data.amenities || [],
      notes: data.notes
    });
    return { success: true };
  });
