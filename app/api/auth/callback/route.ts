import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // 1. Prepare the redirect response object first
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_CLIENT_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // 2. Set cookies on both the request AND the outgoing response
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // 3. Exchange the code (this invokes setAll under the hood)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 4. Return the response object containing the new session cookies
      return response
    }
  }

  // Return to error route if exchange fails or code is missing
  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}