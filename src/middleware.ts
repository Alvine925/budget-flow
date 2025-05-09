
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
    console.error("Middleware Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is not set. Please check your .env file and ensure the Next.js server has been restarted.");
    hasConfigError = true;
  } else if (supabaseUrl === "YOUR_SUPABASE_URL" || supabaseUrl.length < 10 || !supabaseUrl.startsWith("http")) {
    console.error(`Middleware Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is invalid or a placeholder: '${supabaseUrl}'. Please check your .env file and restart the server.`);
    hasConfigError = true;
  }

  if (!supabaseAnonKey) {
    console.error("Middleware Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please check your .env file and ensure the Next.js server has been restarted.");
    hasConfigError = true;
  } else if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY" || supabaseAnonKey.length < 20) {
     console.error(`Middleware Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a placeholder or invalid. Length: ${supabaseAnonKey.length}. Please check your .env file and restart the server.`);
    hasConfigError = true;
  }

  if (supabaseUrl && !hasConfigError) { 
      try {
        new URL(supabaseUrl);
      } catch (error: any) {
         console.error(`Middleware Supabase Config Error: Invalid Supabase URL format: ${supabaseUrl}. Error: ${error.message}. Please ensure it's a valid URL (e.g., https://your-project-id.supabase.co) and restart the server.`);
         hasConfigError = true;
      }
  }

  if (hasConfigError) {
      console.warn("Middleware: Supabase client initialization skipped due to configuration errors. The application might not function correctly. Please check server logs for details, ensure .env variables are correct, and that the server was restarted.");
      // Allow request to proceed to potentially show a more user-friendly error page or allow public routes.
      // Forcing an error response here might break public parts of the site or error display mechanisms.
      return response; 
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

    // Attempt to refresh the session
    await supabase.auth.getSession();

  } catch (e: any) {
    // Log the error but still pass the request through.
    // Subsequent page-level auth checks or Supabase client usage will handle failures.
    console.error("Middleware Exception during Supabase client operation:", e.message);
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
