const SUPABASE_URL = "http://192.168.31.138:54321";
const SUPABASE_ANON_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

export const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
console.log("Supabase client loaded:", supabaseClient);
