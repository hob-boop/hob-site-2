import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {ServiceSpoke} from '@/components/ServiceSpoke'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Skin Fade Christchurch | House of Barber',
  description:
    'Sharp, clean skin fades in Christchurch from $55. Tailored to you by our barbers at Halswell or Christchurch Central. Book now.',
}

export default async function SkinFadePage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  if (!settings) return null
  const service = data?.services?.find((s) => s.title === 'Skin Fade')

  return (
    <ServiceSpoke
      settings={settings}
      activeHref="/services/skin-fade"
      kicker="Skin fade, Christchurch"
      heading="Skin Fade"
      subtitle="A crisp, bald-to-blended fade, cut to the shape of your head, not a template."
      crumb="Skin Fade"
      service={service}
      paragraphs={[
        'A good skin fade lives or dies on the blend — the gradual step from bare skin up into length on top, with no visible lines where the clipper guards changed. Our barbers take their time on that transition, checking it from every angle before you leave the chair.',
        'Whether you want it tight and high or low and subtle, tell your barber the look you’re after and they’ll shape the fade to suit your hair type and head shape, not just repeat the same cut on everyone.',
      ]}
    />
  )
}
