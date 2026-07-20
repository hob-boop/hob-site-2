import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/lib/client'
import {GUIDE_PAGE_QUERY, GUIDE_SLUGS_QUERY} from '@/sanity/lib/queries'
import type {GuidePageData} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'

export const revalidate = 60

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const slugs: {slug: string}[] = await client.fetch(GUIDE_SLUGS_QUERY)
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const data: GuidePageData = await client.fetch(GUIDE_PAGE_QUERY, {slug})
  const guide = data?.guide

  if (!guide) return {title: 'Guide — House of Barber'}

  return {title: guide.title ?? undefined, description: guide.excerpt ?? undefined}
}

export default async function GuidePage({params}: Props) {
  const {slug} = await params
  const data: GuidePageData = await client.fetch(GUIDE_PAGE_QUERY, {slug})
  const settings = data?.settings
  const guide = data?.guide

  if (!settings || !guide) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    author: {'@type': 'Organization', name: settings.brandName ?? 'House of Barber'},
    publisher: {'@type': 'Organization', name: settings.brandName ?? 'House of Barber'},
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleSchema)}}
      />

      <SiteHeader settings={settings} activeHref="/guides" />

      <PageHero
        kicker={guide.kicker ?? 'Guide'}
        heading={guide.title ?? ''}
        subtitle={guide.excerpt ?? ''}
        crumb={guide.title ?? ''}
      />

      <section>
        <div className="wrap" style={{maxWidth: 680}}>
          {guide.body?.map((block) =>
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

      <SiteFooter settings={settings} />
    </>
  )
}
