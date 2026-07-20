import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Comb Over Haircut Christchurch | House of Barber',
  description:
    'Sharp comb over haircuts in Christchurch, tailored to your hair type. Book with our barbers at Halswell or the CBD.',
}

export default async function CombOverPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null
  const styleCut = data?.services?.find((s) => s.title === 'Style Cut')

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/comb-over"
      kicker="Comb over, Christchurch"
      heading="Comb Over Haircut"
      subtitle="Length on top, swept and shaped, with a clean fade or taper underneath."
      crumb="Comb Over"
      service={styleCut}
      paragraphs={[
        'A comb over pairs longer length on top — enough to sweep and hold a part — with a tighter fade or taper on the sides. It’s booked as a Style Cut; just tell your barber it’s the comb over you’re after and they’ll cut and finish it accordingly.',
        'It works on most hair types, though thicker hair holds the sweep with less product than fine hair does — your barber can talk you through what to expect for yours.',
      ]}
    />
  )
}
