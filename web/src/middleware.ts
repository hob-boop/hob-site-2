import {NextResponse, type NextRequest} from 'next/server'
import {BUSINESS} from '@/lib/businessInfo'

/**
 * Sends a rel="canonical" Link header on every page, pointing at the
 * www.houseofbarber.co.nz version of that path. This tells Google which URL is
 * the official one even when the same page is reached through a vercel.app or
 * old domain, without touching each page's metadata.
 */
export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl
  const path = pathname === '/' ? '' : pathname.replace(/\/+$/, '')
  const response = NextResponse.next()
  response.headers.set('Link', `<${BUSINESS.url}${path}>; rel="canonical"`)
  return response
}

export const config = {
  // Pages only: skip API routes, Next internals and static files.
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
}
