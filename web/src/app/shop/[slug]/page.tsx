import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/lib/client'
import {PRODUCT_PAGE_QUERY, PRODUCT_SLUGS_QUERY} from '@/sanity/lib/queries'
import type {ProductPageData} from '@/sanity/lib/types'
import {LEGACY_PRODUCT_IMAGES} from '@/sanity/lib/legacyMedia'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {AddToCart} from '@/components/AddToCart'

export const revalidate = 60

type Params = {slug: string}

export async function generateStaticParams() {
  const slugs: {slug: string}[] = await client.fetch(PRODUCT_SLUGS_QUERY)
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: {params: Promise<Params>}): Promise<Metadata> {
  const {slug} = await params
  const data: ProductPageData = await client.fetch(PRODUCT_PAGE_QUERY, {slug})
  const product = data?.product
  if (!product) return {}

  return {
    title: `${product.title} | House of Barber Shop`,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({params}: {params: Promise<Params>}) {
  const {slug} = await params
  const data: ProductPageData = await client.fetch(PRODUCT_PAGE_QUERY, {slug})
  const settings = data?.settings
  const product = data?.product

  if (!settings || !product) notFound()

  const imageUrl = product.image?.url ?? (product.url ? LEGACY_PRODUCT_IMAGES[product.url] : undefined)

  return (
    <>
      <SiteHeader settings={settings} activeHref="/shop" />

      <section className="shop-sec pd">
        <div className="wrap">
          <div className="pd-crumb">
            <a href="/">Home</a> <span>/</span> <a href="/shop">Shop</a> <span>/</span>{' '}
            <span>{product.title}</span>
          </div>

          <div className="pd-grid">
            <div className="pd-image">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.image?.alt ?? product.title ?? ''}
                  width={700}
                  height={700}
                  sizes="(max-width: 820px) 100vw, 50vw"
                  placeholder={product.image?.lqip ? 'blur' : 'empty'}
                  blurDataURL={product.image?.lqip ?? undefined}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  priority
                />
              ) : null}
            </div>

            <div className="pd-info">
              <h1>{product.title}</h1>
              <div className="pd-price">${product.price}</div>
              {product.description ? <p className="pd-desc">{product.description}</p> : null}

              <AddToCart
                slug={product.slug ?? ''}
                title={product.title ?? ''}
                price={product.price ?? 0}
                image={imageUrl ?? null}
              />

              <p className="pd-note">
                Reserve online, pay in store — no payment is taken on this website. Add it to your cart and
                submit your details; we&apos;ll hold your item and you can pay by card or cash when you pick
                it up.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
