
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client instance for use in browser environments (Client Components).
 * Reads connection details from environment variables prefixed with NEXT_PUBLIC_.
 *
 * IMPORTANT: If you modify NEXT_PUBLIC_ environment variables, you MUST restart
 * your Next.js development server for the changes to take effect on the client-side.
 *
 * @returns {SupabaseClient} A Supabase client instance.
 * @throws {Error} If Supabase URL or Anon Key environment variables are not set or invalid.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl) {
    console.error("CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is not set. Please check your .env file and ensure the Next.js server has been restarted.");
    throw new Error("ConfigurationError: Supabase URL is missing. Check server logs for details.");
  } else if (supabaseUrl === "YOUR_SUPABASE_URL" || supabaseUrl.length < 10 || !supabaseUrl.startsWith("http")) {
    // Added length and startsWith check for more robustness
    console.error(`CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is invalid or a placeholder: '${supabaseUrl}'. Please check your .env file and restart the server.`);
    throw new Error("ConfigurationError: Supabase URL is invalid. Check server logs for details.");
  }

  if (!supabaseAnonKey) {
     console.error("CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please check your .env file and ensure the Next.js server has been restarted.");
    throw new Error("ConfigurationError: Supabase Anon Key is missing. Check server logs for details.");
  } else if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY" || supabaseAnonKey.length < 20) {
    // Added length check
     console.error(`CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a placeholder or invalid: (length: ${supabaseAnonKey.length}). Please check your .env file and restart the server.`);
    throw new Error("ConfigurationError: Supabase Anon Key is invalid. Check server logs for details.");
  }

  try {
    new URL(supabaseUrl);
  } catch (error: any) {
     console.error(`CLIENT Supabase Config Error: Invalid Supabase URL format: ${supabaseUrl}. Error: ${error.message}. Please ensure it's a valid URL (e.g., https://your-project-id.supabase.co) and restart the server.`);
    throw new Error(`ConfigurationError: Supabase URL format invalid. Check server logs for details.`);
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

