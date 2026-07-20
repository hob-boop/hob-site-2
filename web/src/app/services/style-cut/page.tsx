import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Style Cut Christchurch | House of Barber',
  description:
    'Scissor or clipper style cuts in Christchurch from $45, shaped to you. Book online at Halswell or Christchurch Central.',
}

export default async function StyleCutPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null
  const service = data?.services?.find((s) => s.title === 'Style Cut')

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/style-cut"
      kicker="Style cut, Christchurch"
      heading="Style Cut"
      subtitle="Scissor or clipper, shaped to how your hair actually grows."
      crumb="Style Cut"
      service={service}
      paragraphs={[
        'Our style cut covers the classics — a scissor cut, a clipper cut, or a mix of both — shaped to your hair type and how you wear it day to day. It’s the cut most guys come back for on a regular schedule.',
        'New here? Tell your barber what’s worked (and what hasn’t) in the past and they’ll build the cut around that, rather than starting from scratch every time.',
      ]}
    />
  )
}
