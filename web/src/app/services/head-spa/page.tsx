import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Head Spa Christchurch | House of Barber',
  description:
    'Head spa & scalp massage treatments in Christchurch. The full reset — book online at Halswell or Christchurch Central.',
}

export default async function HeadSpaPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null
  const service = data?.services?.find((s) => s.title === 'Head Spa & Massage')

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/head-spa"
      kicker="Head spa & scalp massage, Christchurch"
      heading="Head Spa"
      subtitle="Switch off. A proper scalp massage and head spa treatment, not just a wash."
      crumb="Head Spa"
      service={service}
      paragraphs={[
        'Our head spa treatment is built around a proper scalp massage — the kind that works out the tension you didn’t realise you were carrying, not just a quick shampoo before the cut.',
        'It pairs well with any haircut or works as its own booking if you just want the reset. Ask in-shop for what’s included and we’ll talk you through it.',
      ]}
    />
  )
}
