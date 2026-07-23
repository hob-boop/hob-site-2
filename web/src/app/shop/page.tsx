import type {Metadata} from 'next'
import Image from 'next/image'
import {client} from '@/sanity/lib/client'
import {SHOP_PAGE_QUERY} from '@/sanity/lib/queries'
import type {ShopPageData} from '@/sanity/lib/types'
import {LEGACY_PRODUCT_IMAGES} from '@/sanity/lib/legacyMedia'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {Reveal} from '@/components/Reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: "Men's Grooming Products NZ | House of Barber",
  description:
    'Shop the beard oils, clays and styling products we use in the chair. NZ-wide shipping, Christchurch pickup available.',
}

export default async function ShopPage() {
  const data: ShopPageData = await client.fetch(SHOP_PAGE_QUERY)
  const settings = data?.settings
  const products = data?.products ?? []

  if (!settings) return null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/shop" />

      <PageHero
        kicker="Men's grooming products, NZ-wide"
        heading="Shop"
        subtitle="The beard oils, clays and styling products we actually use in the chair."
        crumb="Shop"
      />

      <section className="shop-sec">
        <div className="wrap">
          <div className="grid g4">
            {products.map((p, i) => (
              <Reveal key={p._id} delay={(i % 4) * 80}>
                <a className="prod" href={p.slug ? `/shop/${p.slug}` : '/shop'}>
                  <div className="ph">
                    {(p.image?.url ?? LEGACY_PRODUCT_IMAGES[p.url ?? '']) ? (
                      <Image
                        src={p.image?.url ?? LEGACY_PRODUCT_IMAGES[p.url ?? '']}
                        alt={p.image?.alt ?? p.title ?? ''}
                        width={400}
                        height={400}
                        sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw"
                        placeholder={p.image?.lqip ? 'blur' : 'empty'}
                        blurDataURL={p.image?.lqip ?? undefined}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                    ) : null}
                  </div>
                  <div className="b">
                    <h4>{p.title}</h4>
                    <div className="pr">${p.price}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
