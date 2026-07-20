import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Beard Trim Christchurch | House of Barber',
  description:
    'Beard trims from $30 in Christchurch, lined up and tidied with a hot towel finish. Walk-ins welcome at both our locations.',
}

export default async function BeardTrimPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null
  const service = data?.services?.find((s) => s.title === 'Beard Trim')

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/beard-trim"
      kicker="Beard trim, Christchurch"
      heading="Beard Trim"
      subtitle="Lined up, shaped and tidied — a beard that looks deliberate, not just grown."
      crumb="Beard Trim"
      service={service}
      paragraphs={[
        'A beard trim is more than an even length — it’s a clean neckline, a defined cheek line, and edges shaped to your face rather than a straight edge across the jaw. Our barbers finish every trim with a hot towel to soften the skin and settle the cut.',
        'Book it on its own or pair it with a haircut in the same visit — either way, walk-ins are welcome at both our Christchurch locations.',
      ]}
    />
  )
}
