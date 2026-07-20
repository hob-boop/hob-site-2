import type {Metadata} from 'next'
import Image from 'next/image'
import {client} from '@/sanity/lib/client'
import {BARBERS_PAGE_QUERY} from '@/sanity/lib/queries'
import type {BarbersPageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {Reveal} from '@/components/Reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Best Barbers in Christchurch | Meet the Team',
  description:
    "Meet the team behind Christchurch's best-rated barbers: Ben, CJ, Jay, Jhon, Jose, Tetiana & Zoli. Pick your barber, book online.",
}

export default async function BarbersPage() {
  const data: BarbersPageData = await client.fetch(BARBERS_PAGE_QUERY)
  const settings = data?.settings
  const barbers = data?.barbers ?? []

  if (!settings) return null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/barbers" />

      <PageHero
        kicker="Best barbers in Christchurch"
        heading="Meet the Team"
        subtitle="Every cut on this site comes from one of these chairs. Pick a barber and see their work."
        crumb="Barbers"
      />

      <section>
        <div className="wrap">
          <div className="grid g4">
            {barbers.map((b, i) =>
              b.slug ? (
                <Reveal key={b._id} delay={(i % 4) * 80}>
                  <a className="svc" href={`/barbers/${b.slug}`}>
                    {b.photo?.url ? (
                      <div style={{aspectRatio: '1', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 'var(--sp4)'}}>
                        <Image
                          src={b.photo.url}
                          alt={b.photo.alt ?? b.name ?? ''}
                          width={300}
                          height={300}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                      </div>
                    ) : null}
                    <h3>{b.name}</h3>
                    <p>{b.bio ?? b.role}</p>
                  </a>
                </Reveal>
              ) : null,
            )}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
