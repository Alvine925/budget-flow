
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client instance for use in browser environments (Client Components).
 * Reads connection details from environment variables prefixed with NEXT_PUBLIC_.
 *
 * @returns {SupabaseClient} A Supabase client instance.
 * @throws {Error} If Supabase URL or Anon Key environment variables are not set or invalid.
 */
export function createClient() {
  // Trim potential whitespace
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Check if variables exist
  if (!supabaseUrl) {
    console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Please check your .env file.");
  }
  if (!supabaseAnonKey) {
     console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env file.");
  }

  // Validate URL format (basic check)
  try {
    new URL(supabaseUrl);
  } catch (error) {
     console.error(`Invalid Supabase URL format: ${supabaseUrl}`);
     console.error("Original error:", error); // Log the original error for more details
    throw new Error(`Invalid Supabase URL format provided in NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
  }


  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

