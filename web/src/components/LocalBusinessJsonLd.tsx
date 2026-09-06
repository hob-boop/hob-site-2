import {BUSINESS} from '@/lib/businessInfo'

type Props = {
  rating?: number | null
  ratingCount?: number | null
  imageUrl?: string | null
  mapUrl?: string | null
}

/**
 * Emits LocalBusiness (HairSalon) structured data so Google can show the
 * business panel — name, address, phone, hours and star rating — in search
 * and Maps. Address and hours come from BUSINESS (a single source of truth);
 * the rating is passed in so it always reflects the latest Sanity value.
 */
export function LocalBusinessJsonLd({rating, ratingCount, imageUrl, mapUrl}: Props) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${BUSINESS.url}/#localbusiness`,
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: BUSINESS.sameAs,
  }

  if (imageUrl) {
    data.image = imageUrl
    data.logo = imageUrl
  }
  if (mapUrl) data.hasMap = mapUrl
  if (typeof rating === 'number' && typeof ratingCount === 'number' && ratingCount > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
  )
}
