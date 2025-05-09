
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

  // Explicitly log what process.env is seeing
  console.log("Middleware trying to read NEXT_PUBLIC_SUPABASE_URL, value:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Middleware trying to read NEXT_PUBLIC_SUPABASE_ANON_KEY, value:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Log trimmed values
  console.log("Middleware: Trimmed supabaseUrl:", supabaseUrl);
  console.log("Middleware: Trimmed supabaseAnonKey:", supabaseAnonKey);

  let hasConfigError = false;
  let configErrorMessage = "Middleware Supabase Config Error: ";
  let detailedErrorForClient = "Internal Server Error: Invalid Supabase configuration detected in middleware. Please check server logs for more details.";


  if (!supabaseUrl) {
    configErrorMessage += "NEXT_PUBLIC_SUPABASE_URL is not set. ";
    hasConfigError = true;
  } else if (supabaseUrl === "YOUR_SUPABASE_URL" || supabaseUrl.length < 10 || !supabaseUrl.startsWith("https://")) {
    configErrorMessage += `NEXT_PUBLIC_SUPABASE_URL is invalid or still a placeholder: '${supabaseUrl}'. Ensure it starts with https://. `;
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
      configErrorMessage += "Please check your .env file (or environment variables for your deployment), ensure all Supabase variables are correct, and that the Next.js server has been restarted.";
      console.error(configErrorMessage); 
      return new NextResponse(JSON.stringify({ error: detailedErrorForClient }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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
            response = NextResponse.next({ request: { headers: request.headers } }); 
            response.cookies.set({ name, value, ...options });
          } catch (e) { 
            // Errors here can happen if `set` is called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({ request: { headers: request.headers } }); 
            response.cookies.set({ name, value: '', ...options });
          } catch (e) {
            // Errors here can happen if `remove` is called from a Server Component.
           }
        },
      },
    });

    await supabase.auth.getSession();

  } catch (e: any) {
    console.error("Middleware Exception during Supabase client operation:", e.message);
    // If Supabase client creation or getSession fails after passing initial config checks,
    // it could be a runtime issue with Supabase itself or network.
    return new NextResponse(JSON.stringify({ error: "Internal Server Error: Could not connect to authentication service. Check server logs." }), { status: 503, headers: { 'Content-Type': 'application/json' } });
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

