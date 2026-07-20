import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SERVICES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ServicesPageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {Reveal} from '@/components/Reveal'
import {ServiceIcon} from '@/components/icons'
import {ServicePrice} from '@/components/ServicePrice'

export const revalidate = 60

export const metadata: Metadata = {
  title: "Men's Hair Salon Christchurch | Services",
  description:
    "Full men's haircut menu in Christchurch: style cuts, skin fades, beard trims & more. Walk-ins welcome, easy online booking.",
}

export default async function ServicesPage() {
  const data: ServicesPageData = await client.fetch(SERVICES_PAGE_QUERY)
  const settings = data?.settings
  const services = data?.services ?? []

  if (!settings) return null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/services" />

      <PageHero
        kicker="Men's hair salon, Christchurch"
        heading="Services"
        subtitle="Every men's haircut, shave and treatment on the menu — walk in or book straight in."
        crumb="Services"
      />

      <section>
        <div className="wrap">
          <div className="grid g4">
            {services.map((s, i) => (
              <Reveal key={s._id} delay={(i % 4) * 80}>
                <a className="svc" href={s.link ?? settings.bookingUrl ?? '#'}>
                  <div className="ic">
                    <ServiceIcon name={s.icon} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <div className="pr">
                    <ServicePrice service={s} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="book">
            <div className="kicker">Ready when you are</div>
            <h2>Book your next cut</h2>
            <p>Walk-ins welcome, but booking ahead saves the wait.</p>
            {settings.bookingUrl ? (
              <a
                className="btn btn-primary"
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.bookingLabel ?? 'Book Now'}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
