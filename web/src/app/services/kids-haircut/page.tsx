import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kids Haircut Christchurch | House of Barber',
  description:
    'Kids haircuts in Christchurch from our friendly barbers. Patient, quick and tidy. Book online at either location.',
}

export default async function KidsHaircutPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/kids-haircut"
      kicker="Kids haircuts, Christchurch"
      heading="Kids Haircut"
      subtitle="Patient, quick and tidy — a good first (or fiftieth) haircut."
      crumb="Kids Haircut"
      fallbackNote="Mention your child's age when you book and we'll fit them in with the right barber."
      paragraphs={[
        'A kids haircut isn’t just a smaller version of a men’s cut — it’s about keeping things quick and calm, especially for a first visit. Our barbers take it at whatever pace your kid needs.',
        'Walk-ins are welcome, but if you’d rather book a time (especially outside school-run rush), give us a call or book online.',
      ]}
    />
  )
}
