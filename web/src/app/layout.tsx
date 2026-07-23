import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {Analytics} from '@vercel/analytics/next'
import {SpeedInsights} from '@vercel/speed-insights/next'
import './globals.css'
import {client} from '@/sanity/lib/client'
import {SEO_QUERY, SOCIAL_LINKS_QUERY} from '@/sanity/lib/queries'
import {FloatingSocial} from '@/components/FloatingSocial'
import {CartProvider} from '@/components/CartProvider'

export const revalidate = 60

type Seo = {
  brandName: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
} | null

export async function generateMetadata(): Promise<Metadata> {
  let seo: Seo = null
  try {
    seo = await client.fetch(SEO_QUERY)
  } catch (error) {
    console.error('[sanity] Could not load SEO settings:', error)
  }

  const title = seo?.seoTitle || seo?.brandName || 'House of Barber'

  return {
    title,
    description: seo?.seoDescription ?? undefined,
    openGraph: {
      title,
      description: seo?.seoDescription ?? undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
      type: 'website',
    },
  }
}

export default async function RootLayout({children}: {children: ReactNode}) {
  let socialLinks: {_key: string; platform: string; url: string}[] = []
  try {
    const data = await client.fetch(SOCIAL_LINKS_QUERY)
    socialLinks = data?.socialLinks ?? []
  } catch (error) {
    console.error('[sanity] Could not load social links:', error)
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Zilla+Slab:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <FloatingSocial links={socialLinks} />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
