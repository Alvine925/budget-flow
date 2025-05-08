
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

  // Trim potential whitespace from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // ---- START: Environment Variable Validation ----
  if (!supabaseUrl) {
    console.error("Middleware Error: Missing environment variable NEXT_PUBLIC_SUPABASE_URL.");
    // Optionally return an error response, or just proceed without Supabase
    // return NextResponse.json({ error: 'Internal Server Error: Missing Supabase configuration (URL).' }, { status: 500 });
    return response; // Proceed without Supabase client if URL is missing
  }
  if (!supabaseAnonKey) {
    console.error("Middleware Error: Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    // Optionally return an error response, or just proceed without Supabase
    // return NextResponse.json({ error: 'Internal Server Error: Missing Supabase configuration (Key).' }, { status: 500 });
    return response; // Proceed without Supabase client if key is missing
  }

  // Basic URL validation
  try {
    new URL(supabaseUrl);
  } catch (error) {
     console.error(`Middleware Error: Invalid Supabase URL format: ${supabaseUrl}`);
     console.error("Original error:", error); // Log original error
     // Return a more specific error if config is invalid during middleware execution
     return NextResponse.json({ error: 'Internal Server Error: Invalid Supabase URL configuration detected in middleware.' }, { status: 500 });
  }
  // ---- END: Environment Variable Validation ----


  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Refresh session if expired - important for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  // This might fail if the URL/Key were syntactically valid but incorrect credentials
  try {
     await supabase.auth.getSession();
  } catch (error) {
     console.error("Middleware Error getting Supabase session:", error);
     // Decide how to handle session errors - potentially redirect to login or show an error
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

