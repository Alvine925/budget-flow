import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client instance for use in browser environments (Client Components).
 * Reads connection details from environment variables prefixed with NEXT_PUBLIC_.
 *
 * @returns {SupabaseClient} A Supabase client instance.
 * @throws {Error} If Supabase URL or Anon Key environment variables are not set or are placeholders.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if variables exist
  if (!supabaseUrl) {
    console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Please check your .env file.");
  }
  if (!supabaseAnonKey) {
     console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env file.");
  }

  // Check if variables are still placeholders
  if (supabaseUrl === "YOUR_SUPABASE_URL") {
    console.error("Supabase URL is set to the placeholder value. Please update your .env file with your actual Supabase project URL.");
    throw new Error("Invalid Supabase URL configuration. Please update NEXT_PUBLIC_SUPABASE_URL in your .env file.");
  }
  if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    console.error("Supabase Anon Key is set to the placeholder value. Please update your .env file with your actual Supabase anonymous key.");
     throw new Error("Invalid Supabase Anon Key configuration. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.");
  }


  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
