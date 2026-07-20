/**
 * Migrates every image from the old houseofbarbernz.co.nz site into Sanity
 * and wires each one to the right document field.
 *
 * Safe to re-run: it skips any field that already has an image, so a partial
 * run can simply be repeated.
 *
 * Usage:
 *   export SANITY_WRITE_TOKEN=<a token with Editor permissions>
 *   node scripts/migrate-images.mjs
 *
 * Create the token at:
 *   https://www.sanity.io/manage/project/z4yj6bjg/api#tokens
 */

import {createClient} from '@sanity/client'

const PROJECT_ID = 'z4yj6bjg'
const DATASET = 'production'
const OLD = 'https://houseofbarbernz.co.nz'

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. See the comment at the top of this file.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
})

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

const LOGO = `${OLD}/uploads/files/logo.png`
const WELCOME_THUMB = `${OLD}/uploads/post/1174599714511.jpg`

/** Product photos, matched to documents by their shop URL. */
const PRODUCT_IMAGES = [
  {
    url: `${OLD}/jelly-beard-oil-bossman-brands/`,
    image: `${OLD}/images/jelly-beard-oil-bossman-brands-11745991641814204201.jpg`,
    alt: 'Jelly Beard Oil',
  },
  {
    url: `${OLD}/slick-gorilla-hair-styling-powder/`,
    image: `${OLD}/images/slick-gorilla-hair-styling-powder-11745991344424204201.jpg`,
    alt: 'Slick Gorilla Hair Styling Powder',
  },
  {
    url: `${OLD}/bluebeards-revenge-sea-salt-spray/`,
    image: `${OLD}/images/bluebeards-revenge-sea-salt-spray-11745989517654204201.jpg`,
    alt: 'Bluebeards Revenge Sea Salt Spray',
  },
  {
    url: `${OLD}/layrite-natural-matte-cream/`,
    image: `${OLD}/images/layrite-natural-matte-cream-11745988501784204201.jpg`,
    alt: 'Layrite Natural Matte Cream',
  },
]

async function upload(url) {
  const filename = url.split('/').pop() ?? 'image'
  process.stdout.write(`  fetching ${filename} … `)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {filename})

  console.log(`uploaded (${(buffer.length / 1024).toFixed(0)} KB)`)
  return asset._id
}

const imageRef = (assetId, alt) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: assetId},
  ...(alt ? {alt} : {}),
})

const keyedImage = (assetId, alt, key) => ({...imageRef(assetId, alt), _key: key})

async function main() {
  console.log(`\nMigrating images into ${PROJECT_ID}/${DATASET}\n`)

  const settings = await client.getDocument('siteSettings')
  const home = await client.getDocument('homePage')

  // ---- Logo ----
  if (settings?.logo?.asset) {
    console.log('Logo: already set, skipping.')
  } else {
    console.log('Logo:')
    const id = await upload(LOGO)
    await client.patch('siteSettings').set({logo: imageRef(id, 'House of Barber')}).commit()
  }

  // ---- Hero slides ----
  if (home?.heroSlides?.length) {
    console.log('Hero slides: already set, skipping.')
  } else {
    console.log('Hero slides:')
    const slides = []
    for (let i = 0; i < HERO_SLIDES.length; i++) {
      const id = await upload(HERO_SLIDES[i])
      slides.push(keyedImage(id, 'House of Barber', `hero${i + 1}`))
    }
    await client.patch('homePage').set({heroSlides: slides}).commit()
  }

  // ---- Welcome video thumbnail ----
  if (home?.welcomeVideoThumbnail?.asset) {
    console.log('Welcome thumbnail: already set, skipping.')
  } else {
    console.log('Welcome thumbnail:')
    const id = await upload(WELCOME_THUMB)
    await client
      .patch('homePage')
      .set({welcomeVideoThumbnail: imageRef(id, 'Welcome to The House')})
      .commit()
  }

  // ---- Gallery ----
  if (home?.galleryImages?.length) {
    console.log('Gallery: already set, skipping.')
  } else {
    console.log('Gallery:')
    const images = []
    for (let i = 0; i < GALLERY.length; i++) {
      const id = await upload(GALLERY[i])
      images.push(keyedImage(id, 'Our work', `work${i + 1}`))
    }
    await client.patch('homePage').set({galleryImages: images}).commit()
  }

  // ---- Products ----
  console.log('Products:')
  for (const p of PRODUCT_IMAGES) {
    const doc = await client.fetch('*[_type == "product" && url == $url][0]{_id, image}', {url: p.url})
    if (!doc?._id) {
      console.log(`  no product found for ${p.url} — skipping`)
      continue
    }
    if (doc.image?.asset) {
      console.log(`  ${p.alt}: already set, skipping.`)
      continue
    }
    const id = await upload(p.image)
    await client.patch(doc._id).set({image: imageRef(id, p.alt)}).commit()
  }

  console.log('\nDone. Images are live on the published documents.\n')
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message)
  process.exit(1)
})
