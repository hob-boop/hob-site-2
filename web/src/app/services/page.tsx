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

      <section className="shop-sec">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">More from the menu</div>
            <h2>Every Cut, Explained</h2>
            <hr className="rule" />
          </div>
          <div className="grid g4">
            {[
              {href: '/services/skin-fade', label: 'Skin Fade'},
              {href: '/services/beard-trim', label: 'Beard Trim'},
              {href: '/services/style-cut', label: 'Style Cut'},
              {href: '/services/combo-haircut-beard', label: 'Combo: Cut & Beard'},
              {href: '/services/hot-towel-shave', label: 'Hot Towel Shave'},
              {href: '/services/head-spa', label: 'Head Spa'},
              {href: '/services/kids-haircut', label: 'Kids Haircut'},
              {href: '/services/comb-over', label: 'Comb Over'},
            ].map((item, i) => (
              <Reveal key={item.href} delay={(i % 4) * 80}>
                <a className="prod" href={item.href} style={{padding: 'var(--sp5)', display: 'block'}}>
                  <h4 style={{fontSize: 17, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald'}}>
                    {item.label}
                  </h4>
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
