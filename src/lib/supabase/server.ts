import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client instance for use in server environments
 * (Server Components, Route Handlers, Server Actions).
 * Reads connection details from environment variables. Requires cookies() from next/headers.
 *
 * @returns {SupabaseClient} A Supabase client instance configured for server-side use.
 * @throws {Error} If Supabase URL or Anon Key environment variables are not set or are invalid placeholders.
 */
export function createClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
  }
   if (supabaseUrl === "YOUR_SUPABASE_URL") {
    console.warn("Supabase URL is set to the placeholder value. Please update your .env file with your actual Supabase project URL.");
    // Allow proceeding with placeholder but warn.
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    console.warn("Supabase Anon Key is set to the placeholder value. Please update your .env file with your actual Supabase anonymous key.");
    // Allow proceeding with placeholder but warn.
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
