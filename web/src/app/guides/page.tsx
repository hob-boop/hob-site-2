import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {GUIDES_PAGE_QUERY} from '@/sanity/lib/queries'
import type {GuidesPageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {Reveal} from '@/components/Reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Barbering Guides & Grooming Tips | House of Barber',
  description:
    'Haircut, fade and beard advice from the House of Barber team in Christchurch. Grooming tips you can actually use.',
}

export default async function GuidesPage() {
  const data: GuidesPageData = await client.fetch(GUIDES_PAGE_QUERY)
  const settings = data?.settings
  const guides = data?.guides ?? []

  if (!settings) return null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/guides" />

      <PageHero
        kicker="Grooming tips"
        heading="Guides"
        subtitle="Haircut, fade and beard advice from our barbers — the stuff we get asked in the chair."
        crumb="Guides"
      />

      <section>
        <div className="wrap">
          <div className="grid g4">
            {guides.map((g, i) =>
              g.slug ? (
                <Reveal key={g._id} delay={(i % 4) * 80}>
                  <a className="svc" href={`/guides/${g.slug}`}>
                    {g.kicker ? <div className="kicker" style={{marginBottom: 'var(--sp3)'}}>{g.kicker}</div> : null}
                    <h3>{g.title}</h3>
                    <p>{g.excerpt}</p>
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
