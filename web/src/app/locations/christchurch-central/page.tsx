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
import {BUSINESS} from '@/lib/businessInfo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Barber Christchurch Central | Guthrey Centre, Cashel St',
  description:
    'House of Barber in the Guthrey Centre, 126 Cashel Street, Christchurch Central. Skin fades, beard trims & hot towel shaves. Walk-ins welcome.',
}

// Address comes from the shared NAP record so it always matches the footer,
// the site-wide LocalBusiness JSON-LD and the Google Business Profile.
const ADDRESS = `${BUSINESS.address.streetAddress}, Christchurch Central`

export default async function ChristchurchCentralPage() {
  const data: LocationPageData = await client.fetch(LOCATION_PAGE_QUERY)
  const settings = data?.settings
  const services = data?.services ?? []

  if (!settings) return null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/locations/christchurch-central" />

      <PageHero
        kicker="Christchurch Central"
        heading="Barber in the Guthrey Centre"
        subtitle={`${ADDRESS} — in the heart of Christchurch City, walk-ins welcome.`}
        crumb="Christchurch Central"
      />

      <section>
        <div className="wrap" style={{maxWidth: 720}}>
          <p style={{color: 'var(--slate)', fontSize: 17, marginBottom: 'var(--sp4)'}}>
            Our Christchurch Central shop sits at {ADDRESS} — easy to find if you're already in the CBD for
            work, shopping or a coffee.
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
            <h2>Services at Christchurch Central</h2>
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
            <div className="kicker">Christchurch Central</div>
            <h2>Book Christchurch Central</h2>
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
