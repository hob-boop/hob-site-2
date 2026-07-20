import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {WORK_PAGE_QUERY} from '@/sanity/lib/queries'
import type {WorkPageData} from '@/sanity/lib/types'
import {LEGACY_GALLERY, asImage} from '@/sanity/lib/legacyMedia'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {GalleryGrid} from '@/components/GalleryGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Best Barbershop Christchurch | Our Work',
  description:
    "See why House of Barber is rated Christchurch's best barbershop. Browse real cuts, fades and beard work from our chairs.",
}

export default async function WorkPage() {
  const data: WorkPageData = await client.fetch(WORK_PAGE_QUERY)
  const settings = data?.settings

  if (!settings) return null

  const sanityGallery = (data?.home?.galleryImages ?? []).filter((g) => g?.url)
  const galleryImages = sanityGallery.length
    ? sanityGallery
    : LEGACY_GALLERY.map((url, i) => asImage(url, 'Our work', `legacy-work-${i}`))

  return (
    <>
      <SiteHeader settings={settings} activeHref="/work" />

      <PageHero
        kicker="Christchurch's best barbershop"
        heading="Our Work"
        subtitle="Fresh cuts from the chair — top rated in Christchurch, click a photo for a closer look."
        crumb="Our Work"
      />

      <section className="work">
        <div className="wrap">
          <GalleryGrid images={galleryImages} />
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
