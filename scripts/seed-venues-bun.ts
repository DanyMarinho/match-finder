import { VENUES } from "../src/data/venues";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log(`Found ${VENUES.length} venues. Starting seed...`);

  // Transform VENUES to match the DB schema (snake_case columns)
  const toInsert = VENUES.map(v => ({
    id: v.id,
    name: v.name,
    neighborhood: v.neighborhood,
    address: v.address,
    coords: v.coords, // JSONB handles [lat, lng]
    amenities: v.amenities,
    rating: v.rating,
    entry: v.entry,
    hours: v.hours,
    phone: v.phone,
    whatsapp: v.whatsapp,
    image: v.image,
    description: v.description,
    matches: v.matches,
    broadcast_packages: v.broadcastPackages,
    last_verified: v.lastVerified.split('T')[0], // Just the date part
    operational_status: v.operationalStatus,
    claimed: v.claimed,
    live_confirmations: v.liveConfirmations,
    suggested: v.suggested || false
  }));

  // Chunk inserts because 107 venues might hit limits or just be cleaner
  const chunkSize = 20;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('venues').upsert(chunk);
    if (error) {
      console.error(`Error inserting chunk ${i}:`, error);
    } else {
      console.log(`Inserted chunk starting at ${i}`);
    }
  }

  console.log("Seed complete!");
}

main().catch(console.error);
