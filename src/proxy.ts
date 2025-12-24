import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";

export async function proxy(request: NextRequest) {
  /*
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const callbackURL = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", callbackURL);
    return NextResponse.redirect(loginUrl);
  }
  */
  return NextResponse.next();
}

export const config = {
  matcher: ["/thread/:path*"],
};
