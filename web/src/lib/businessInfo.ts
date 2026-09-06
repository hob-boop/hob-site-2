/**
 * Single source of truth for the shop's name, address, phone and hours (NAP).
 *
 * Verified against the House of Barber Google Business Profile on 2026-09-06.
 * There is currently no address field on the Sanity `siteSettings` document,
 * so the address lives here. The star rating and review count are NOT here on
 * purpose — those are managed in Sanity (and refreshed by the weekly Google
 * cron) and passed into the JSON-LD as props so they stay current.
 *
 * If an `address` field is ever added to siteSettings, swap these reads for the
 * query result and delete this file.
 */
export const BUSINESS = {
  name: 'House of Barber',
  url: 'https://www.houseofbarber.co.nz',
  phoneDisplay: '03 390 0106',
  phoneE164: '+6433900106',
  email: 'houseofbarbernz@gmail.com',
  priceRange: '$$',
  currenciesAccepted: 'NZD',
  address: {
    streetAddress: '126 Cashel Street, Guthrey Centre',
    addressLocality: 'Christchurch',
    addressRegion: 'Canterbury',
    postalCode: '8011',
    addressCountry: 'NZ',
  },
  /** Human-readable footer lines (the map/Google keeps the canonical version). */
  addressLines: ['126 Cashel Street, Guthrey Centre', 'Christchurch Central City, 8011'],
  /** Confirmed opening hours as schema.org OpeningHoursSpecification entries. */
  openingHours: [
    {days: ['Monday', 'Tuesday'], opens: '09:00', closes: '18:00'},
    {days: ['Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '20:00'},
    {days: ['Saturday'], opens: '09:00', closes: '18:00'},
    {days: ['Sunday'], opens: '09:00', closes: '17:00'},
  ],
  sameAs: [
    'https://www.instagram.com/houseofbarber.nz',
    'https://www.facebook.com/houseofbarber.nz',
    'https://www.messenger.com/t/houseofbarber.nz',
  ],
} as const
