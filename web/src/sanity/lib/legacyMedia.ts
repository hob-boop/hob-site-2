/**
 * TEMPORARY: fallback media.
 *
 * These are the original asset URLs from houseofbarbernz.co.nz. They're used
 * only where the matching Sanity image field is still empty, so the site
 * renders correctly before the migration has been run.
 *
 * As soon as an image is uploaded in the Studio (or POST /api/migrate-images
 * is triggered), the Sanity asset wins and the corresponding entry here stops
 * being used. Once everything is migrated this whole file can be deleted along
 * with the houseofbarbernz.co.nz entry in next.config.ts.
 */

const OLD = 'https://houseofbarbernz.co.nz'

export const LEGACY_LOGO = `${OLD}/uploads/files/logo.png`

export const LEGACY_WELCOME_THUMB = `${OLD}/uploads/post/1174599714511.jpg`

export const LEGACY_HERO_SLIDES = [
  `${OLD}/uploads/post/1174599723470.jpg`,
  `${OLD}/uploads/post/1174599729970.jpg`,
  `${OLD}/uploads/post/1174599743515.jpg`,
]

export const LEGACY_GALLERY = [
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

/** Keyed by the product's shop URL, which is what the CMS stores. */
export const LEGACY_PRODUCT_IMAGES: Record<string, string> = {
  [`${OLD}/jelly-beard-oil-bossman-brands/`]: `${OLD}/images/jelly-beard-oil-bossman-brands-11745991641814204201.jpg`,
  [`${OLD}/slick-gorilla-hair-styling-powder/`]: `${OLD}/images/slick-gorilla-hair-styling-powder-11745991344424204201.jpg`,
  [`${OLD}/bluebeards-revenge-sea-salt-spray/`]: `${OLD}/images/bluebeards-revenge-sea-salt-spray-11745989517654204201.jpg`,
  [`${OLD}/layrite-natural-matte-cream/`]: `${OLD}/images/layrite-natural-matte-cream-11745988501784204201.jpg`,
}

/** Shapes a bare URL like a queried Sanity image so components can share a path. */
export function asImage(url: string, alt: string, key: string) {
  return {url, lqip: null, dimensions: null, alt, _key: key}
}
