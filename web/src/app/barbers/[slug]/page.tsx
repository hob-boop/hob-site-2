import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import {client} from '@/sanity/lib/client'
import {BARBER_PAGE_QUERY, BARBER_SLUGS_QUERY} from '@/sanity/lib/queries'
import type {BarberPageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'

export const revalidate = 60

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const slugs: {slug: string}[] = await client.fetch(BARBER_SLUGS_QUERY)
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const data: BarberPageData = await client.fetch(BARBER_PAGE_QUERY, {slug})
  const name = data?.barber?.name

  if (!name) return {title: 'Barber — House of Barber'}

  return {
    title: `${name} — Barber in Christchurch | House of Barber`,
    description: `Book a cut with ${name}, barber at House of Barber Christchurch. See ${
      name === 'Tetiana' ? 'her' : 'his'
    } work and book your next appointment online.`,
  }
}

export default async function BarberPage({params}: Props) {
  const {slug} = await params
  const data: BarberPageData = await client.fetch(BARBER_PAGE_QUERY, {slug})
  const settings = data?.settings
  const barber = data?.barber

  if (!settings || !barber) notFound()

  return (
    <>
      <SiteHeader settings={settings} activeHref="/barbers" />

      <PageHero
        kicker={barber.role ?? 'Barber'}
        heading={barber.name ?? ''}
        subtitle={`Book a cut with ${barber.name} at House of Barber Christchurch.`}
        crumb={barber.name ?? ''}
      />

      <section>
        <div className="wrap" style={{maxWidth: 720}}>
          <div style={{display: 'flex', gap: 'var(--sp6)', alignItems: 'center', flexWrap: 'wrap'}}>
            {barber.photo?.url ? (
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid var(--accent)',
                }}
              >
                <Image
                  src={barber.photo.url}
                  alt={barber.photo.alt ?? barber.name ?? ''}
                  width={180}
                  height={180}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
            ) : null}
            <p style={{color: 'var(--slate)', fontSize: 17, flex: 1, minWidth: 240}}>
              {barber.bio ?? `${barber.name} is a barber at House of Barber Christchurch.`}
            </p>
          </div>

          <div className="book" style={{marginTop: 'var(--sp7)'}}>
            <div className="kicker">Book with {barber.name}</div>
            <h2>Ready for a cut?</h2>
            <p>Walk-ins welcome, or book online and request {barber.name} by name.</p>
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
