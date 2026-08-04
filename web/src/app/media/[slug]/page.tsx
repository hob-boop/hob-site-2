import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/lib/client'
import {MEDIA_PAGE_QUERY, MEDIA_SLUGS_QUERY} from '@/sanity/lib/queries'
import type {MediaMentionPageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'

export const revalidate = 60

type Params = {slug: string}

export async function generateStaticParams() {
  const slugs: {slug: string}[] = await client.fetch(MEDIA_SLUGS_QUERY)
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: {params: Promise<Params>}): Promise<Metadata> {
  const {slug} = await params
  const data: MediaMentionPageData = await client.fetch(MEDIA_PAGE_QUERY, {slug})
  const mention = data?.mention

  if (!mention) return {title: 'In the Media — House of Barber'}

  return {title: `${mention.title} | House of Barber`, description: mention.excerpt ?? undefined}
}

export default async function MediaMentionPage({params}: {params: Promise<Params>}) {
  const {slug} = await params
  const data: MediaMentionPageData = await client.fetch(MEDIA_PAGE_QUERY, {slug})
  const settings = data?.settings
  const mention = data?.mention

  if (!settings || !mention) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: mention.title,
    description: mention.excerpt,
    publisher: {'@type': 'Organization', name: settings.brandName ?? 'House of Barber'},
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleSchema)}}
      />

      <SiteHeader settings={settings} activeHref="/" />

      <PageHero
        kicker={[mention.badgeBig, mention.badgeSmall].filter(Boolean).join(' · ') || 'In the Media'}
        heading={mention.title ?? ''}
        subtitle={mention.excerpt ?? ''}
        crumb={mention.title ?? ''}
      />

      <section>
        <div className="wrap" style={{maxWidth: 680}}>
          {mention.body?.map((block) =>
            block._type === 'subheading' ? (
              <h2 key={block._key} style={{fontSize: 22, margin: 'var(--sp7) 0 var(--sp3)'}}>
                {block.text}
              </h2>
            ) : (
              <p key={block._key} style={{color: 'var(--slate)', fontSize: 17, marginBottom: 'var(--sp4)'}}>
                {block.text}
              </p>
            ),
          )}
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="book">
            <div className="kicker">Ready when you are</div>
            <h2>Come see for yourself</h2>
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
