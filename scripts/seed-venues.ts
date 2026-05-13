import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read the venues.ts file as text
const content = fs.readFileSync('src/data/venues.ts', 'utf-8');

// We need to extract the VENUES array. Since it's a TS file with imports, 
// a simple regex might be fragile, but the structure is quite regular.
// Better: We'll use a hack to evaluate it or just parse the JSON-like structure.
// Given the complexity of the file (templates, logic), regex is risky.
// Let's use a simpler approach: regex to find everything between 'export const VENUES: Venue[] = [' and '];' at the end.

const match = content.match(/export const VENUES: Venue\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not find VENUES array in src/data/venues.ts");
  process.exit(1);
}

let venuesStr = match[1];

// Clean up the string to be valid JSON (removing 't("16:00")' and other TS logic)
// The file uses t("HH:MM") which is defined as: const t = (hh: string) => `2026-05-10T${hh}:00-03:00`;
venuesStr = venuesStr.replace(/t\("(\d{2}:\d{2})"\)/g, '"2026-05-10T$1:00-03:00"');
venuesStr = venuesStr.replace(/new Date\(Date\.now\(\) - (\d+) \* 60 \* 1000\)\.toISOString\(\)/g, '"2026-05-13T18:00:00Z"'); // Approximation
// Remove trailing commas in objects/arrays for valid JSON (though JSON5 might handle it, native JSON won't)
// But wait, the file is valid JS. I can just run it in a node context if I mock the types.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // Since we can't easily eval the TS file with all its dependencies,
  // let's just do a search and replace for the most common patterns and hope it's valid JSON-ish.
  // Actually, I'll just use a more robust regex to extract individual venue objects.
  
  // A better way: Use the raw data from the file as much as possible.
  // I will use a simple regex to get each object { ... } and parse it.
  
  // Wait, I can just use the 'VENUES' if I import it? No, because it's a TS file.
  
  // Let's try to parse the array by cleaning it up.
  const cleaned = venuesStr
    .replace(/\/\/.*$/gm, '') // Remove comments
    .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas
    .replace(/(\w+):/g, '"$1":') // Quote keys
    .replace(/'/g, '"'); // Use double quotes
    
  try {
    // This is still risky. Let's try a different approach.
    // I'll use code--exec to run a bun script that uses the existing TS file.
    // Bun can run TS files directly!
  } catch (e) {
    console.error(e);
  }
}

seed();
