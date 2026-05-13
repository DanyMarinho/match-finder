-- Create venues table
CREATE TABLE public.venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    address TEXT NOT NULL,
    coords JSONB NOT NULL, -- [lat, lng]
    amenities TEXT[] DEFAULT '{}',
    rating FLOAT DEFAULT 0,
    entry TEXT,
    hours TEXT,
    phone TEXT,
    whatsapp TEXT,
    image TEXT,
    description TEXT,
    matches JSONB DEFAULT '[]',
    broadcast_packages TEXT[] DEFAULT '{}',
    last_verified DATE DEFAULT CURRENT_DATE,
    operational_status TEXT DEFAULT 'open',
    claimed BOOLEAN DEFAULT false,
    live_confirmations INTEGER DEFAULT 0,
    suggested BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for venues
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for venues" ON public.venues
    FOR SELECT USING (true);

-- Create check_ins table
CREATE TABLE public.check_ins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id TEXT REFERENCES public.venues(id) ON DELETE CASCADE,
    user_id UUID, -- For authenticated users
    device_id TEXT, -- Fallback for semi-anonymous tracking if needed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for check_ins
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for check_ins" ON public.check_ins
    FOR SELECT USING (true);

CREATE POLICY "Users can check in" ON public.check_ins
    FOR INSERT WITH CHECK (true); -- We will handle rate limiting in the server function

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id TEXT REFERENCES public.venues(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'crowded', 'no_tv', etc.
    votes INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '3 hours')
);

-- Enable RLS for alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active alerts" ON public.alerts
    FOR SELECT USING (expires_at > now());

CREATE POLICY "Anyone can report alerts" ON public.alerts
    FOR INSERT WITH CHECK (true);

-- Create registrations table (for new bar requests)
CREATE TABLE public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    amenities TEXT[] DEFAULT '{}',
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit registration" ON public.registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view registrations" ON public.registrations
    FOR SELECT USING (false); -- Admin tool would use service_role or specific metadata

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_venues_updated_at
    BEFORE UPDATE ON public.venues
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to clean up expired alerts (to be called by cron or just filtered by view)
-- The select policy already filters them, so we just need a periodic cleanup for DB size
