import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Combo Haircut & Beard Trim Christchurch',
  description:
    'Get a full style cut and beard trim in one visit at House of Barber Christchurch. Two locations, easy online booking.',
}

export default async function ComboPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null
  const styleCut = data?.services?.find((s) => s.title === 'Style Cut')
  const beardTrim = data?.services?.find((s) => s.title === 'Beard Trim')

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/combo-haircut-beard"
      kicker="Combo, Christchurch"
      heading="Haircut & Beard Combo"
      subtitle="Style cut and beard trim, done together in one visit."
      crumb="Combo"
      fallbackNote={
        styleCut && beardTrim
          ? `Book a Style Cut (from $${styleCut.price}) and a Beard Trim (from $${beardTrim.price}) together — just say the word when you book.`
          : 'Ask your barber to combine a Style Cut and a Beard Trim in the same booking.'
      }
      paragraphs={[
        'Most guys who wear a beard get it lined up at the same time as their haircut — it keeps both in sync and saves a second trip. Book a Style Cut and Beard Trim together and your barber will work through both in one sitting.',
        'It’s the same care as booking each on its own, just scheduled back to back so you’re in and out once instead of twice.',
      ]}
    />
  )
}
