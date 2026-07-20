import type {JSX} from 'react'

export function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1.4" />
      <circle cx="18" cy="21" r="1.4" />
      <path d="M1 1h3l2.6 13.4a1.8 1.8 0 0 0 1.8 1.45h9.7a1.8 1.8 0 0 0 1.78-1.5l1.6-8.85H5.2" />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1.1l-2.2 2.1z" />
    </svg>
  )
}

export function MessengerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.3 2 2 6.2 2 11.6c0 2.9 1.3 5.4 3.4 7.1V22l3.1-1.7c.8.2 1.6.3 2.5.3 5.7 0 10-4.2 10-9.6S17.7 2 12 2zm1 12.3-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7z" />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

/** The clipper glyph used by the "Skin Fade" card in the original design. */
function ClippersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="3" x2="6" y2="6" />
      <line x1="9" y1="3" x2="9" y2="6" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="15" y1="3" x2="15" y2="6" />
      <line x1="18" y1="3" x2="18" y2="6" />
      <rect x="4" y="6" width="16" height="3" rx="1" />
      <path d="M6 9 v8 a2 2 0 0 0 2 2 h8 a2 2 0 0 0 2-2 V9" />
      <line x1="9.5" y1="13" x2="14.5" y2="13" />
    </svg>
  )
}

/**
 * Maps the icon chosen in the CMS to what gets rendered.
 * Most are typographic glyphs, exactly as in the original markup.
 */
const GLYPHS: Record<string, string> = {
  scissors: '\u2702',
  razor: '\u25D7',
  spa: '\u2732',
  beard: '\u2301',
  star: '\u2605',
}

export function ServiceIcon({name}: {name: string | null}): JSX.Element {
  if (name === 'clippers') return <ClippersIcon />
  return <>{GLYPHS[name ?? 'scissors'] ?? GLYPHS.scissors}</>
}

export function SocialIcon({platform}: {platform: string}): JSX.Element | null {
  switch (platform) {
    case 'phone':
      return <PhoneIcon />
    case 'messenger':
      return <MessengerIcon />
    case 'instagram':
      return <InstagramIcon />
    case 'facebook':
      return <FacebookIcon />
    default:
      return null
  }
}
