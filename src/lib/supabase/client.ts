import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client instance for use in browser environments (Client Components).
 * Reads connection details from environment variables prefixed with NEXT_PUBLIC_.
 *
 * @returns {SupabaseClient} A Supabase client instance.
 * @throws {Error} If Supabase URL or Anon Key environment variables are not set.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
  }
   if (supabaseUrl === "YOUR_SUPABASE_URL") {
    console.warn("Supabase URL is set to the placeholder value. Please update your .env file with your actual Supabase project URL.");
    // Optionally, you could throw an error here or return a dummy client
    // depending on desired behavior during development without proper keys.
    // For now, we'll allow it but warn.
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
   if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    console.warn("Supabase Anon Key is set to the placeholder value. Please update your .env file with your actual Supabase anonymous key.");
    // Optionally, throw an error or return a dummy client.
  }


  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
