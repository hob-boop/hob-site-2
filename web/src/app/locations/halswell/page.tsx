import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {LOCATION_PAGE_QUERY} from '@/sanity/lib/queries'
import type {LocationPageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {ServiceIcon} from '@/components/icons'
import {ServicePrice} from '@/components/ServicePrice'
import {Reveal} from '@/components/Reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Barber Halswell | House of Barber Christchurch',
  description:
    'House of Barber Halswell — your local barbershop for sharp cuts, fades & beard trims. Walk-ins welcome, easy online booking.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: 'House of Barber — Halswell',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Halswell, Christchurch',
    addressCountry: 'NZ',
  },
}

export default async function HalswellPage() {
  const data: LocationPageData = await client.fetch(LOCATION_PAGE_QUERY)
  const settings = data?.settings
  const services = data?.services ?? []

  if (!settings) return null

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}}
      />

      <SiteHeader settings={settings} activeHref="/locations/halswell" />

      <PageHero
        kicker="Halswell"
        heading="Barber in Halswell"
        subtitle="Your local barbershop in Halswell — sharp cuts, fades and beard trims, walk-ins welcome."
        crumb="Halswell"
      />

      <section>
        <div className="wrap" style={{maxWidth: 720}}>
          <p style={{color: 'var(--slate)', fontSize: 17, marginBottom: 'var(--sp4)'}}>
            House of Barber Halswell is the local chair for the southwest side of Christchurch — same barbers
            and the same menu as our Christchurch Central shop, just closer to home if you're in Halswell.
          </p>
          {settings.phone ? (
            <p style={{fontSize: 17, marginBottom: 'var(--sp4)'}}>
              <strong>Phone:</strong>{' '}
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
            </p>
          ) : null}
          {settings.openingHours?.length ? (
            <div style={{marginBottom: 'var(--sp6)'}}>
              <strong>Hours</strong>
              {settings.openingHours.map((row) => (
                <div key={row._key} style={{color: 'var(--slate)'}}>
                  {row.days} · {row.hours}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="shop-sec">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">On the menu</div>
            <h2>Services in Halswell</h2>
            <hr className="rule" />
          </div>
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
            <div className="kicker">Halswell</div>
            <h2>Book your Halswell barber</h2>
            <p>Walk-ins welcome, or book ahead online.</p>
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
