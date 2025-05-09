
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to handle Supabase session refresh and management for server-side rendering.
 * Ensures user sessions are consistently maintained across requests.
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} The response object, potentially with updated session cookies.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  let hasConfigError = false;

  if (!supabaseUrl) {
    console.error("Middleware Critical Error: Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Ensure it's set in your .env file and the server was restarted.");
    hasConfigError = true;
  } else if (supabaseUrl === "YOUR_SUPABASE_URL" || supabaseUrl.length < 10 || !supabaseUrl.startsWith("http")) {
    console.error(`Middleware Critical Error: NEXT_PUBLIC_SUPABASE_URL is invalid ('${supabaseUrl}'). Please update your .env file with your actual Supabase project URL.`);
    hasConfigError = true;
  }

  if (!supabaseAnonKey) {
    console.error("Middleware Critical Error: Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure it's set in your .env file and the server was restarted.");
    hasConfigError = true;
  } else if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY" || supabaseAnonKey.length < 20) {
     console.error(`Middleware Critical Error: NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a placeholder or invalid. Please update your .env file.`);
    hasConfigError = true;
  }

  if (supabaseUrl && !hasConfigError) { 
      try {
        new URL(supabaseUrl);
      } catch (error: any) {
         console.error(`Middleware Critical Error: Invalid Supabase URL format: ${supabaseUrl}. Error: ${error.message}`);
         hasConfigError = true;
      }
  }

  if (hasConfigError) {
      console.warn("Middleware: Supabase client initialization skipped due to configuration errors. The application might not function correctly. Please check server logs for details and ensure .env variables are correct and the server was restarted.");
      return response; // Pass through, don't return JSON error
  }

  try {
    const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value, ...options });
            // Re-create response to apply updated cookies
            response = NextResponse.next({ request: { headers: request.headers } });
            response.cookies.set({ name, value, ...options });
          } catch (e) { 
            // Ignore errors if `set` is called from a Server Component - Supabase handles this.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value: '', ...options });
            // Re-create response to apply updated cookies
            response = NextResponse.next({ request: { headers: request.headers } });
            response.cookies.set({ name, value: '', ...options });
          } catch (e) {
            // Ignore errors if `remove` is called from a Server Component - Supabase handles this.
           }
        },
      },
    });

    await supabase.auth.getSession();
  } catch (e: any) {
    console.error("Middleware Exception during Supabase client initialization or getSession:", e.message);
    // Log the error but still pass the request through.
    // Subsequent page-level auth checks should handle failures.
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
