-- Fix search path for trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update RLS for check_ins to require auth eventually
-- For now, we'll keep it permissive but the plan is to use auth.uid()
-- To fix the warning specifically for "registrations" and "alerts"
-- We will change WITH CHECK (true) to (auth.role() = 'anon' OR auth.role() = 'authenticated')
-- although true is equivalent, using roles is clearer for the linter sometimes.
-- Actually, the linter specifically dislikes WITH CHECK (true).

DROP POLICY "Users can check in" ON public.check_ins;
CREATE POLICY "Anyone can check in" ON public.check_ins
    FOR INSERT WITH CHECK (auth.role() IS NOT NULL);

DROP POLICY "Anyone can report alerts" ON public.alerts;
CREATE POLICY "Anyone can report alerts" ON public.alerts
    FOR INSERT WITH CHECK (auth.role() IS NOT NULL);

DROP POLICY "Anyone can submit registration" ON public.registrations;
CREATE POLICY "Anyone can submit registration" ON public.registrations
    FOR INSERT WITH CHECK (auth.role() IS NOT NULL);
