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

const MAP_EMBED =
  'https://www.google.com/maps?q=House+Of+Barber,+Guthrey+Centre,+126+Cashel+Street,+Christchurch+Central+City,+Christchurch+8011&output=embed'

// Plain-text Q&A. Rendered on the page AND emitted as FAQPage JSON-LD, so the
// two can never drift apart. Keep answers factual — Google checks they match.
const FAQS: {q: string; a: string}[] = [
  {
    q: 'Do I need to book, or can I walk in?',
    a: 'Walk-ins are welcome whenever a chair is free. If you want a specific barber or a set time, book online — it takes under a minute and guarantees your spot.',
  },
  {
    q: 'Where exactly are you?',
    a: 'Inside the Guthrey Centre at 126 Cashel Street, beside Ballantynes, in the middle of the Christchurch CBD.',
  },
  {
    q: 'Are you open late?',
    a: 'Yes — we stay open until 8pm Wednesday to Friday, so you can come in after work. We are also open seven days, including Sunday 9am to 5pm.',
  },
  {
    q: 'Where can I park?',
    a: 'Several CBD parking buildings and on-street parks are within a few minutes’ walk of Cashel Street. If you are coming by bus, the Bus Interchange is a short walk away.',
  },
  {
    q: 'Do you cut kids’ hair?',
    a: 'Yes. We offer a dedicated kids’ haircut, and our barbers are patient with first cuts and younger clients.',
  },
  {
    q: 'What do you specialise in?',
    a: 'Skin fades, tapers, scissor cuts, beard trims and shaping, and traditional hot towel shaves. We also offer a relaxing head spa.',
  },
]

function FaqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {'@type': 'Answer', text: f.a},
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
}

const prose = {color: 'var(--slate)', fontSize: 17, lineHeight: 1.7, marginBottom: 'var(--sp4)'} as const

export default async function ChristchurchCentralPage() {
  const data: LocationPageData = await client.fetch(LOCATION_PAGE_QUERY)
  const settings = data?.settings
  const services = data?.services ?? []

  if (!settings) return null

  const rating = typeof settings.googleRating === 'number' ? settings.googleRating.toFixed(1) : null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/locations/christchurch-central" />
      <FaqJsonLd />

      <PageHero
        kicker="Christchurch Central"
        heading="Barber in the Guthrey Centre"
        subtitle={`${ADDRESS} — in the heart of Christchurch City, walk-ins welcome.`}
        crumb="Christchurch Central"
      />

      {/* ===== INTRO ===== */}
      <section>
        <div className="wrap" style={{maxWidth: 760}}>
          <p style={prose}>
            House of Barber sits inside the Guthrey Centre at 126 Cashel Street, right beside Ballantynes on one of the
            city&rsquo;s busiest shopping streets. If you work in the CBD, you&rsquo;re in town for shopping or
            you&rsquo;re grabbing a coffee on Cashel Mall, we&rsquo;re a couple of minutes away.
          </p>
          <p style={prose}>
            We&rsquo;ve been cutting hair in central Christchurch since 2020, and our team brings more than a
            decade of barbering experience to every chair. Whether it&rsquo;s a crisp skin fade, a classic scissor
            cut, a beard tidy-up or a full hot towel shave, every service starts with a proper consultation so the
            cut suits your hair, your face shape and your routine.
            {rating ? (
              <>
                {' '}
                That care is why we&rsquo;re rated{' '}
                {settings.mapUrl ? (
                  <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer">
                    {rating} stars on Google
                  </a>
                ) : (
                  <>{rating} stars on Google</>
                )}
                .
              </>
            ) : null}
          </p>
          <p style={prose}>
            We&rsquo;re open seven days, with late nights until 8pm Wednesday to Friday — so you can fit a cut in
            after work without rushing. Walk in when you&rsquo;re passing, or book online to lock in your favourite
            barber.
          </p>

          <div style={{display: 'grid', gap: 'var(--sp5)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 'var(--sp6)'}}>
            <div>
              <strong>Address</strong>
              {BUSINESS.addressLines.map((line) => (
                <div key={line} style={{color: 'var(--slate)'}}>
                  {line}
                </div>
              ))}
              {settings.phone ? (
                <div style={{marginTop: 'var(--sp3)'}}>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                </div>
              ) : null}
            </div>
            {settings.openingHours?.length ? (
              <div>
                <strong>Hours</strong>
                {settings.openingHours.map((row) => (
                  <div key={row._key} style={{color: 'var(--slate)'}}>
                    {row.days} · {row.hours}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ===== GETTING HERE ===== */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">Getting here</div>
            <h2>Find us on Cashel Street</h2>
            <hr className="rule" />
          </div>
          <div style={{maxWidth: 760, margin: '0 auto var(--sp6)'}}>
            <p style={prose}>
              The Guthrey Centre is on Cashel Street in the central city, next to Ballantynes and a short stroll
              from Cashel Mall, the Bridge of Remembrance and the Riverside Market area. Several CBD parking
              buildings and on-street parks are within a few minutes&rsquo; walk, and the Bus Interchange is close
              by if you&rsquo;re coming in by bus.
            </p>
          </div>
          <div className="map-frame">
            <iframe
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Map to House of Barber, Guthrey Centre, 126 Cashel Street, Christchurch"
            />
          </div>
          {settings.mapUrl ? (
            <p style={{textAlign: 'center', marginTop: 'var(--sp4)'}}>
              <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer">
                Get directions in Google Maps →
              </a>
            </p>
          ) : null}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
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
          <p style={{textAlign: 'center', marginTop: 'var(--sp6)'}}>
            <a href="/services">See every service and price →</a>
            {'  ·  '}
            <a href="/barbers">Meet the barbers →</a>
            {'  ·  '}
            <a href="/guides">Hair &amp; beard guides →</a>
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section>
        <div className="wrap" style={{maxWidth: 760}}>
          <div className="sec-head">
            <div className="kicker">Good to know</div>
            <h2>Christchurch Central FAQs</h2>
            <hr className="rule" />
          </div>
          {FAQS.map((f) => (
            <div key={f.q} style={{marginBottom: 'var(--sp5)'}}>
              <h3 style={{fontSize: 19, marginBottom: 'var(--sp2)'}}>{f.q}</h3>
              <p style={{...prose, marginBottom: 0}}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BOOK ===== */}
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
