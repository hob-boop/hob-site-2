import {NextResponse} from 'next/server'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '@/sanity/lib/env'

/**
 * One-shot migration of the media from the old site into Sanity.
 *
 * This runs on Vercel rather than locally because Vercel's servers can reach
 * houseofbarbernz.co.nz directly. Trigger it once with:
 *
 *   curl -X POST https://<your-deployment>/api/migrate-images \
 *     -H "x-migrate-secret: <MIGRATE_SECRET>"
 *
 * Requires two environment variables on the Vercel project:
 *   SANITY_WRITE_TOKEN  a token with Editor permissions
 *   MIGRATE_SECRET      any random string, so the route isn't publicly callable
 *
 * Safe to re-run: anything already migrated is skipped, so a partial or
 * timed-out run can simply be repeated.
 */

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const OLD = 'https://houseofbarbernz.co.nz'

const LOGO = `${OLD}/uploads/files/logo.png`
const WELCOME_THUMB = `${OLD}/uploads/post/1174599714511.jpg`

const HERO_SLIDES = [
  `${OLD}/uploads/post/1174599723470.jpg`,
  `${OLD}/uploads/post/1174599729970.jpg`,
  `${OLD}/uploads/post/1174599743515.jpg`,
]

const GALLERY = [
  `${OLD}/uploads/post/11745484095100.jpg`,
  `${OLD}/uploads/post/1174548399894.jpeg`,
  `${OLD}/uploads/post/1174548408365.jpeg`,
  `${OLD}/uploads/post/1174548403897.jpg`,
  `${OLD}/uploads/post/1174548402166.jpg`,
  `${OLD}/uploads/post/1174548403228.jpg`,
  `${OLD}/uploads/post/1174548404999.jpg`,
  `${OLD}/uploads/post/1174548411421.jpeg`,
  `${OLD}/uploads/post/1174548401672.jpg`,
  `${OLD}/uploads/post/1174548409053.jpeg`,
]

const PRODUCT_IMAGES = [
  {
    productUrl: `${OLD}/jelly-beard-oil-bossman-brands/`,
    image: `${OLD}/images/jelly-beard-oil-bossman-brands-11745991641814204201.jpg`,
    alt: 'Jelly Beard Oil',
  },
  {
    productUrl: `${OLD}/slick-gorilla-hair-styling-powder/`,
    image: `${OLD}/images/slick-gorilla-hair-styling-powder-11745991344424204201.jpg`,
    alt: 'Slick Gorilla Hair Styling Powder',
  },
  {
    productUrl: `${OLD}/bluebeards-revenge-sea-salt-spray/`,
    image: `${OLD}/images/bluebeards-revenge-sea-salt-spray-11745989517654204201.jpg`,
    alt: 'Bluebeards Revenge Sea Salt Spray',
  },
  {
    productUrl: `${OLD}/layrite-natural-matte-cream/`,
    image: `${OLD}/images/layrite-natural-matte-cream-11745988501784204201.jpg`,
    alt: 'Layrite Natural Matte Cream',
  },
]

const imageRef = (assetId: string, alt: string) => ({
  _type: 'image' as const,
  asset: {_type: 'reference' as const, _ref: assetId},
  alt,
})

const keyedImage = (assetId: string, alt: string, key: string) => ({
  ...imageRef(assetId, alt),
  _key: key,
})

export async function POST(request: Request) {
  const secret = process.env.MIGRATE_SECRET
  const token = process.env.SANITY_WRITE_TOKEN

  if (!secret || !token) {
    return NextResponse.json(
      {error: 'Set SANITY_WRITE_TOKEN and MIGRATE_SECRET on this project first.'},
      {status: 503},
    )
  }

  if (request.headers.get('x-migrate-secret') !== secret) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

  const log: string[] = []
  const note = (message: string) => {
    log.push(message)
    console.log('[migrate]', message)
  }

  async function upload(url: string) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const filename = url.split('/').pop() || 'image'
    const asset = await client.assets.upload('image', buffer, {filename})
    note(`uploaded ${filename} (${Math.round(buffer.length / 1024)} KB)`)
    return asset._id
  }

  try {
    const settings = await client.getDocument('siteSettings')
    const home = await client.getDocument('homePage')

    // ---- Logo ----
    if (settings?.logo?.asset) {
      note('logo: already set, skipped')
    } else {
      const id = await upload(LOGO)
      await client.patch('siteSettings').set({logo: imageRef(id, 'House of Barber')}).commit()
      note('logo: done')
    }

    // ---- Hero slides ----
    if (home?.heroSlides?.length) {
      note('hero slides: already set, skipped')
    } else {
      const slides = []
      for (let i = 0; i < HERO_SLIDES.length; i++) {
        slides.push(keyedImage(await upload(HERO_SLIDES[i]), 'House of Barber', `hero${i + 1}`))
      }
      await client.patch('homePage').set({heroSlides: slides}).commit()
      note(`hero slides: done (${slides.length})`)
    }

    // ---- Welcome thumbnail ----
    if (home?.welcomeVideoThumbnail?.asset) {
      note('welcome thumbnail: already set, skipped')
    } else {
      const id = await upload(WELCOME_THUMB)
      await client
        .patch('homePage')
        .set({welcomeVideoThumbnail: imageRef(id, 'Welcome to The House')})
        .commit()
      note('welcome thumbnail: done')
    }

    // ---- Gallery ----
    if (home?.galleryImages?.length) {
      note('gallery: already set, skipped')
    } else {
      const images = []
      for (let i = 0; i < GALLERY.length; i++) {
        images.push(keyedImage(await upload(GALLERY[i]), 'Our work', `work${i + 1}`))
      }
      await client.patch('homePage').set({galleryImages: images}).commit()
      note(`gallery: done (${images.length})`)
    }

    // ---- Products ----
    for (const p of PRODUCT_IMAGES) {
      const doc = await client.fetch<{_id: string; image?: {asset?: unknown}} | null>(
        '*[_type == "product" && url == $url][0]{_id, image}',
        {url: p.productUrl},
      )
      if (!doc?._id) {
        note(`product ${p.alt}: no matching document, skipped`)
        continue
      }
      if (doc.image?.asset) {
        note(`product ${p.alt}: already set, skipped`)
        continue
      }
      const id = await upload(p.image)
      await client.patch(doc._id).set({image: imageRef(id, p.alt)}).commit()
      note(`product ${p.alt}: done`)
    }

    return NextResponse.json({ok: true, log})
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[migrate] failed:', message)
    return NextResponse.json({ok: false, error: message, log}, {status: 500})
  }
}
