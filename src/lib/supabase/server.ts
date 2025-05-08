
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client instance for use in server environments
 * (Server Components, Route Handlers, Server Actions).
 * Reads connection details from environment variables. Requires cookies() from next/headers.
 *
 * @returns {SupabaseClient} A Supabase client instance configured for server-side use.
 * @throws {Error} If Supabase URL or Anon Key environment variables are not set or invalid.
 */
export function createClient() {
  const cookieStore = cookies();
  // Trim potential whitespace
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

   // Check if variables exist
   if (!supabaseUrl) {
     console.error("Server Error: Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Ensure it's set in your .env file.");
    throw new Error("Missing Supabase URL configuration.");
  }
  if (!supabaseAnonKey) {
    console.error("Server Error: Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure it's set in your .env file.");
    throw new Error("Missing Supabase Anon Key configuration.");
  }

  // Validate URL format (basic check)
  try {
    new URL(supabaseUrl);
  } catch (error: any) {
    console.error(`Server Error: Invalid Supabase URL format: ${supabaseUrl}`);
    console.error("Original URL validation error:", error); // Log the original error for more details
    throw new Error(`Invalid Supabase URL format provided in NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}. Please ensure it's a valid URL.`);
  }


  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
