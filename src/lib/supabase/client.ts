
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
    console.error("Client Error: Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Ensure it's set in your .env file and the Next.js development server was restarted.");
    throw new Error("Missing Supabase URL configuration.");
  }
  if (!supabaseAnonKey) {
     console.error("Client Error: Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure it's set in your .env file and the Next.js development server was restarted.");
    throw new Error("Missing Supabase Anon Key configuration.");
  }

  // Validate URL format (basic check)
  try {
    new URL(supabaseUrl);
  } catch (error: any) {
     console.error(`Client Error: Invalid Supabase URL format: ${supabaseUrl}`);
     console.error("Original URL validation error:", error); // Log the original error for more details
    throw new Error(`Invalid Supabase URL format provided in NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}. Please ensure it's a valid URL.`);
  }


  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
