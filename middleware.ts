import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Auth disabled for now - Claude will implement later
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
