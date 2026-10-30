import type {MetadataRoute} from 'next'
import {BUSINESS} from '@/lib/businessInfo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/', disallow: '/api/'},
    sitemap: `${BUSINESS.url}/sitemap.xml`,
  }
}
