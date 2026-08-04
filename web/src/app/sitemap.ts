import type {MetadataRoute} from 'next'
import {client} from '@/sanity/lib/client'
import {BARBER_SLUGS_QUERY, GUIDE_SLUGS_QUERY, MEDIA_SLUGS_QUERY} from '@/sanity/lib/queries'

const SITE_URL = 'https://houseofbarbernz.co.nz'

const STATIC_ROUTES = [
  '',
  '/services',
  '/services/skin-fade',
  '/services/beard-trim',
  '/services/style-cut',
  '/services/combo-haircut-beard',
  '/services/hot-towel-shave',
  '/services/head-spa',
  '/services/kids-haircut',
  '/services/comb-over',
  '/shop',
  '/work',
  '/barbers',
  '/guides',
  '/locations/christchurch-central',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [barberSlugs, guideSlugs, mediaSlugs] = await Promise.all([
    client.fetch<{slug: string}[]>(BARBER_SLUGS_QUERY),
    client.fetch<{slug: string}[]>(GUIDE_SLUGS_QUERY),
    client.fetch<{slug: string}[]>(MEDIA_SLUGS_QUERY),
  ])

  const dynamicRoutes = [
    ...barberSlugs.map(({slug}) => `/barbers/${slug}`),
    ...guideSlugs.map(({slug}) => `/guides/${slug}`),
    ...mediaSlugs.map(({slug}) => `/media/${slug}`),
  ]

  return [...STATIC_ROUTES, ...dynamicRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }))
}
