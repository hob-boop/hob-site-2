import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Hot Towel Shave Christchurch | House of Barber',
  description:
    'Traditional hot towel & straight razor shaves in Christchurch. Sit back and relax at Halswell or Christchurch Central.',
}

export default async function HotTowelShavePage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/hot-towel-shave"
      kicker="Hot towel & straight razor, Christchurch"
      heading="Hot Towel Shave"
      subtitle="A traditional straight razor shave, finished with a hot towel."
      crumb="Hot Towel Shave"
      fallbackNote="Ask in-shop or when you book to add a hot towel straight razor shave to your visit."
      paragraphs={[
        'A hot towel shave is the slow version of shaving — the towel opens the pores and softens the hair before the straight razor does the work, finished with a cool towel and balm to calm the skin down.',
        'It’s as much about the ten minutes of sitting back as it is the shave itself. Ask your barber to add it to a haircut or book it as its own visit.',
      ]}
    />
  )
}
