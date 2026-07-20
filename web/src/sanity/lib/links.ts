/**
 * GROQ has no string-replace function, so phone hrefs come back from the
 * query with the spaces the editor typed ("tel:03 390 0106"). Strip them
 * here so the link is a valid tel: URI, and leave every other href alone.
 */
export function cleanHref(href: string | null | undefined): string | undefined {
  if (!href) return undefined
  if (href.startsWith('tel:')) return `tel:${href.slice(4).replace(/[\s()-]/g, '')}`
  return href
}
