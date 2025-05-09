
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
    console.error("CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is not set. Please check your .env file, ensure it contains the correct URL, and that the Next.js server has been restarted.");
    throw new Error("ConfigurationError: Supabase URL is missing. Check .env and restart server. See server logs for details.");
  } else if (supabaseUrl === "YOUR_SUPABASE_URL" || supabaseUrl.length < 10 || !supabaseUrl.startsWith("http")) {
    console.error(`CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is invalid or still a placeholder: '${supabaseUrl}'. Ensure your .env file has the correct URL and the server was restarted.`);
    throw new Error("ConfigurationError: Supabase URL is invalid or a placeholder. Check .env and restart server. See server logs for details.");
  }

  if (!supabaseAnonKey) {
     console.error("CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please check your .env file, ensure it contains the correct key, and that the Next.js server has been restarted.");
    throw new Error("ConfigurationError: Supabase Anon Key is missing. Check .env and restart server. See server logs for details.");
  } else if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY" || supabaseAnonKey.length < 20) {
     console.error(`CLIENT Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a placeholder or invalid (length: ${supabaseAnonKey.length}). Ensure your .env file has the correct key and the server was restarted.`);
    throw new Error("ConfigurationError: Supabase Anon Key is invalid or a placeholder. Check .env and restart server. See server logs for details.");
  }

  try {
    new URL(supabaseUrl); 
  } catch (error: any) {
     console.error(`CLIENT Supabase Config Error: Invalid Supabase URL format in NEXT_PUBLIC_SUPABASE_URL: '${supabaseUrl}'. Error: ${error.message}. Please ensure it's a valid URL (e.g., https://your-project-id.supabase.co) in your .env file and restart the server.`);
    throw new Error(`ConfigurationError: Supabase URL format invalid. Check .env and restart server. See server logs for details.`);
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
