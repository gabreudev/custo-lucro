import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  try {
    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore }) 
      await supabase.auth.exchangeCodeForSession(code)   
    }
  } catch (error) {
    console.log('Auth_Callback', error);
  }

  return NextResponse.redirect(requestUrl.origin)
}
