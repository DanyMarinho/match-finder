-- Create function to increment live_confirmations
CREATE OR REPLACE FUNCTION public.increment_live_confirmations(venue_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.venues
    SET live_confirmations = live_confirmations + 1
    WHERE id = venue_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;
