import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {SETTINGS_QUERY} from '@/sanity/lib/queries'
import type {Settings} from '@/sanity/lib/types'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {PageHero} from '@/components/PageHero'
import {CartClient} from '@/components/CartClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Your Cart | House of Barber',
  description: 'Reserve products online and pay in store when you pick up.',
}

export default async function CartPage() {
  const settings: Settings = await client.fetch(SETTINGS_QUERY)
  if (!settings) return null

  return (
    <>
      <SiteHeader settings={settings} activeHref="/cart" />

      <PageHero
        kicker="Pay in store, not online"
        heading="Your Cart"
        subtitle="Reserve what you need — we'll hold it for you to pay by card or cash in store."
        crumb="Cart"
      />

      <section className="shop-sec">
        <div className="wrap">
          <CartClient />
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
