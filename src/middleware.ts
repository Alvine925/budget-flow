
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
  let configErrorMessage = "Middleware Supabase Config Error: ";

  if (!supabaseUrl) {
    configErrorMessage += "NEXT_PUBLIC_SUPABASE_URL is not set. ";
    hasConfigError = true;
  } else if (supabaseUrl === "YOUR_SUPABASE_URL" || supabaseUrl.length < 10 || !supabaseUrl.startsWith("http")) {
    configErrorMessage += `NEXT_PUBLIC_SUPABASE_URL is invalid or still a placeholder: '${supabaseUrl}'. `;
    hasConfigError = true;
  }

  if (!supabaseAnonKey) {
    configErrorMessage += "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ";
    hasConfigError = true;
  } else if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY" || supabaseAnonKey.length < 20) {
     configErrorMessage += `NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a placeholder or invalid (length: ${supabaseAnonKey.length}). `;
    hasConfigError = true;
  }

  if (supabaseUrl && !hasConfigError) { 
      try {
        new URL(supabaseUrl);
      } catch (error: any) {
         configErrorMessage += `Invalid Supabase URL format in NEXT_PUBLIC_SUPABASE_URL: '${supabaseUrl}'. Error: ${error.message}. `;
         hasConfigError = true;
      }
  }

  if (hasConfigError) {
      configErrorMessage += "Please check your .env file, ensure all Supabase variables are correct, and that the Next.js server has been restarted.";
      console.error(configErrorMessage); // Log the detailed error
      // Allow request to proceed. App-level checks will handle if Supabase client fails.
      // Throwing an error here or returning a different response might mask the root cause or break public routes.
      // Consider returning a specific error response if this middleware is critical for all routes:
      // return new NextResponse(JSON.stringify({ error: "Supabase configuration error in middleware. Check server logs." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      return response; 
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, { // supabaseUrl and supabaseAnonKey are validated to be non-null and correct format if hasConfigError is false
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({ request: { headers: request.headers } }); // Re-create response with new cookies
            response.cookies.set({ name, value, ...options });
          } catch (e) { 
            // Errors here can happen if `set` is called from a Server Component.
            // These can often be ignored if middleware is used to refresh user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({ request: { headers: request.headers } }); // Re-create response with new cookies
            response.cookies.set({ name, value: '', ...options });
          } catch (e) {
            // Errors here can happen if `remove` is called from a Server Component.
           }
        },
      },
    });

    // Attempt to refresh the session.
    // This will update the cookies if necessary.
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
