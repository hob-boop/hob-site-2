import Image from 'next/image'
import {client} from '@/sanity/lib/client'
import {HOMEPAGE_QUERY} from '@/sanity/lib/queries'
import type {HomepageData, ResolvedLink} from '@/sanity/lib/types'
import {cleanHref} from '@/sanity/lib/links'
import {LEGACY_HERO_SLIDES, LEGACY_GALLERY, LEGACY_PRODUCT_IMAGES, asImage} from '@/sanity/lib/legacyMedia'
import {Hero} from '@/components/Hero'
import {TrustStrip} from '@/components/TrustStrip'
import {WelcomeVideo} from '@/components/WelcomeVideo'
import {WorkGallery} from '@/components/WorkGallery'
import {ServiceIcon} from '@/components/icons'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {SectionHead} from '@/components/SectionHead'
import {ServicePrice} from '@/components/ServicePrice'
import {Reveal} from '@/components/Reveal'

export const revalidate = 60

/** Renders a resolved link, or nothing if it has no destination. */
function Btn({link, className}: {link: ResolvedLink; className: string}) {
  if (!link?.href || !link.label) return null
  return (
    <a
      className={className}
      href={cleanHref(link.href)}
      {...(link.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
    >
      {link.label}
    </a>
  )
}

/** Splits text on **bold** so the gold emphasis is editable. */
function Bold({text}: {text: string}) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>))}
    </>
  )
}

/**
 * Renders the reviews footnote, swapping "Rated X.X on Google" for the
 * rating synced from Google each week (see /api/cron/update-google-rating)
 * and linking it to the Google Business page. Falls back to the static copy
 * from Sanity if the sync hasn't run yet.
 */
function Footnote({text, rating, mapUrl}: {text: string; rating: number | null; mapUrl: string | null}) {
  const parts = text.split(/(Rated\s+[\d.]+\s+on\s+Google)/i)
  return (
    <>
      {parts.map((part, i) => {
        if (!/^Rated\s+[\d.]+\s+on\s+Google$/i.test(part)) return <Bold key={i} text={part} />
        const label = rating != null ? part.replace(/[\d.]+/, rating.toFixed(1)) : part
        return mapUrl ? (
          <a key={i} className="rated-link" href={mapUrl} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <span key={i}>{label}</span>
        )
      })}
    </>
  )
}

export default async function HomePage() {
  // Deliberately not wrapped in try/catch. A broken query or bad config should
  // fail the build loudly rather than silently shipping an empty page.
  const data: HomepageData = await client.fetch(HOMEPAGE_QUERY)

  const settings = data?.settings
  const home = data?.home
  const services = data?.services ?? []
  const products = data?.products ?? []
  const reviews = data?.reviews ?? []
  const mediaMentions = data?.mediaMentions ?? []

  if (!settings || !home) {
    return (
      <main style={{padding: '96px 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif'}}>
        <h1 style={{fontFamily: 'Oswald, sans-serif'}}>House of Barber</h1>
        <p>Content is being set up. Please check back shortly.</p>
      </main>
    )
  }

  const sanitySlides = (home.heroSlides ?? []).map((s) => s?.url).filter((u): u is string => Boolean(u))
  const slideUrls = sanitySlides.length ? sanitySlides : LEGACY_HERO_SLIDES

  const sanityGallery = (home.galleryImages ?? []).filter((g) => g?.url)
  const galleryImages = sanityGallery.length
    ? sanityGallery
    : LEGACY_GALLERY.map((url, i) => asImage(url, 'Our work', `legacy-work-${i}`))

  return (
    <>
      <SiteHeader settings={settings} activeHref="/" />

      {/* ===== HERO ===== */}
      <Hero home={home} slideUrls={slideUrls} />

      {/* ===== TRUST STRIP ===== */}
      {home.trustItems?.length ? <TrustStrip items={home.trustItems} /> : null}

      {/* ===== WELCOME ===== */}
      <section className="welcome" id="welcome">
        <div className="wrap">
          <div className="split">
            <WelcomeVideo
              thumbnail={home.welcomeVideoThumbnail}
              videoId={home.welcomeVideoId}
              tag={home.welcomeVideoTag}
            />
            <div className="copy">
              {home.welcomeKicker ? <div className="kicker">{home.welcomeKicker}</div> : null}
              {home.welcomeHeading ? <h2>{home.welcomeHeading}</h2> : null}
              {home.welcomeParagraphs?.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              {home.welcomeBadge ? <span className="badge-soft">{home.welcomeBadge}</span> : null}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services">
        <div className="wrap">
          <SectionHead header={home.servicesHeader} />
          <div className="grid g4">
            {services.map((s, i) => (
              <Reveal key={s._id} delay={(i % 4) * 80}>
                <a className="svc" href={s.link ?? settings.bookingUrl ?? '#'}>
                  <div className="ic">
                    <ServiceIcon name={s.icon} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <div className="pr">
                    <ServicePrice service={s} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          <div style={{textAlign: 'center', marginTop: 'var(--sp7)'}}>
            <Btn link={home.servicesButton} className="btn btn-ghost-dark" />
          </div>
        </div>
      </section>

      {/* ===== SHOP ===== */}
      <section className="shop-sec" id="shop">
        <div className="wrap">
          <SectionHead header={home.shopHeader} />
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
          <div style={{textAlign: 'center', marginTop: 'var(--sp7)'}}>
            <Btn link={home.shopButton} className="btn btn-ghost-dark" />
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section id="reviews">
        <div className="wrap">
          <SectionHead header={home.reviewsHeader} />
          <div className="tlist">
            {reviews.map((r) => (
              <div className="tcard" key={r._id}>
                <div className="stars">{'\u2605'.repeat(r.rating ?? 5)}</div>
                <p>&ldquo;{r.quote}&rdquo;</p>
                <div className="by">
                  <div className="av">{(r.author ?? '?').trim().charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="nm">{r.author}</div>
                    <div className="src">{r.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {home.reviewsFootnote ? (
            <div className="reviews-foot">
              <Footnote text={home.reviewsFootnote} rating={settings.googleRating} mapUrl={settings.mapUrl} />
            </div>
          ) : null}
        </div>
      </section>

      {/* ===== OUR WORK ===== */}
      <section className="work">
        <div className="wrap">
          <SectionHead header={home.workHeader} />
          <WorkGallery images={galleryImages} />
          <div className="cta">
            <Btn link={home.workButton} className="btn btn-ghost-light" />
          </div>
        </div>
      </section>

      {/* ===== IN THE MEDIA ===== */}
      {mediaMentions.length ? (
        <section className="media">
          <div className="wrap">
            {home.mediaHeader ? (
              <div className="sec-head">
                {home.mediaHeader.kicker ? <div className="kicker">{home.mediaHeader.kicker}</div> : null}
                {home.mediaHeader.heading ? <h2>{home.mediaHeader.heading}</h2> : null}
                <hr className="rule" />
                {home.mediaTagline ? <p className="tagline">{home.mediaTagline}</p> : null}
              </div>
            ) : null}
            {mediaMentions.map((m) => (
              <div className="media-card" key={m._id}>
                <div className="badge">
                  <span className="big">{m.badgeBig}</span>
                  {m.badgeSmall ? <span className="sm">{m.badgeSmall}</span> : null}
                </div>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.excerpt}</p>
                  {m.url ? (
                    <a className="read" href={m.url}>
                      {m.linkLabel ?? 'Read more \u2192'}
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ===== FIND US ===== */}
      <section id="location">
        <div className="wrap">
          <div className="sec-head">
            {home.locationKicker ? <div className="kicker">{home.locationKicker}</div> : null}
            {home.locationHeading ? <h2>{home.locationHeading}</h2> : null}
            <hr className="rule" />
            {home.locationSubtitle ? <p>{home.locationSubtitle}</p> : null}
          </div>
          <div className="map-frame">
            <iframe
              src="https://www.google.com/maps?q=House+Of+Barber,+Guthrey+Centre,+126+Cashel+Street,+Christchurch+Central+City,+Christchurch+8011&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="House of Barber location map"
            />
          </div>
          <div style={{textAlign: 'center', marginTop: 'var(--sp7)'}}>
            {settings.mapUrl ? (
              <a className="btn btn-primary" href={settings.mapUrl} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  )
}
