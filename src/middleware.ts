
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
  let hasConfigError = false;
  if (!supabaseUrl) {
    console.error("Middleware Warning: Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Ensure it's set in your .env file and the server was restarted.");
    hasConfigError = true;
    // Allow request to proceed but log the error
    // return NextResponse.json({ error: 'Internal Server Error: Missing Supabase configuration.' }, { status: 500 });
  }
  if (!supabaseAnonKey) {
    console.error("Middleware Warning: Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure it's set in your .env file and the server was restarted.");
    hasConfigError = true;
     // Allow request to proceed but log the error
    // return NextResponse.json({ error: 'Internal Server Error: Missing Supabase configuration.' }, { status: 500 });
  }

  // Basic URL validation only if URL is present
  if (supabaseUrl && !hasConfigError) {
      try {
        new URL(supabaseUrl);
      } catch (error: any) {
         console.error(`Middleware Warning: Invalid Supabase URL format detected: ${supabaseUrl}. Please check NEXT_PUBLIC_SUPABASE_URL in your .env file.`);
         console.error("Original URL validation error:", error); // Log original error
         hasConfigError = true;
         // Allow request to proceed, Supabase client initialization will likely fail later.
         // return NextResponse.json({ error: 'Internal Server Error: Invalid Supabase configuration detected in middleware.' }, { status: 500 });
      }
  }
  // ---- END: Environment Variable Validation ----


  // If there was a configuration error logged above, skip Supabase client creation in middleware
  if (hasConfigError) {
      console.warn("Skipping Supabase client initialization in middleware due to configuration issues.");
      return response;
  }

  // Proceed with Supabase client creation only if config seems okay so far
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
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
     // Log the error but allow the request to proceed. Auth guards on pages should handle unauthorized access.
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
