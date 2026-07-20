import Image from 'next/image'
import {client} from '@/sanity/lib/client'
import {HOMEPAGE_QUERY} from '@/sanity/lib/queries'
import type {HomepageData, ResolvedLink, SectionHeader} from '@/sanity/lib/types'
import {cleanHref} from '@/sanity/lib/links'
import {
  LEGACY_LOGO,
  LEGACY_HERO_SLIDES,
  LEGACY_GALLERY,
  LEGACY_PRODUCT_IMAGES,
  asImage,
} from '@/sanity/lib/legacyMedia'
import {Hero} from '@/components/Hero'
import {WelcomeVideo} from '@/components/WelcomeVideo'
import {WorkGallery} from '@/components/WorkGallery'
import {CartIcon, ServiceIcon} from '@/components/icons'

export const revalidate = 60

/** Section header block: kicker, heading, gold rule, optional intro. */
function SectionHead({header}: {header: SectionHeader}) {
  if (!header) return null
  return (
    <div className="sec-head">
      {header.kicker ? <div className="kicker">{header.kicker}</div> : null}
      {header.heading ? <h2>{header.heading}</h2> : null}
      <hr className="rule" />
      {header.intro ? <p>{header.intro}</p> : null}
    </div>
  )
}

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

/** Formats a service price the way the original design did. */
function servicePrice(s: HomepageData['services'][number]) {
  if (s.priceType === 'enquire') {
    return <small>{s.enquireText ?? 'enquire in-shop'}</small>
  }
  const prefix = s.priceType === 'from' ? 'from ' : ''
  return `${prefix}$${s.price ?? 0}`
}

/** Splits the reviews footnote on **bold** so the gold emphasis is editable. */
function Footnote({text}: {text: string}) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>))}
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

  const logoUrl = settings.logo?.url ?? LEGACY_LOGO

  const sanityGallery = (home.galleryImages ?? []).filter((g) => g?.url)
  const galleryImages = sanityGallery.length
    ? sanityGallery
    : LEGACY_GALLERY.map((url, i) => asImage(url, 'Our work', `legacy-work-${i}`))

  return (
    <>
      {/* ===== NAV ===== */}
      <nav className="bar">
        <div className="wrap">
          <a className="brand" href="#top">
            <span className="emblem">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={settings.logo?.alt ?? settings.brandName ?? 'Logo'}
                  width={52}
                  height={52}
                  style={{height: '88%', width: '88%', objectFit: 'contain'}}
                  priority
                />
              ) : null}
            </span>
            <span className="wm">
              {settings.brandName}
              {settings.brandTagline ? <small>{settings.brandTagline}</small> : null}
            </span>
          </a>

          <div className="links">
            {settings.navLinks?.map((l) =>
              l?.href ? (
                <a
                  key={l._key}
                  href={cleanHref(l.href)}
                  {...(l.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                >
                  {l.label}
                </a>
              ) : null,
            )}
          </div>

          <div className="nav-actions">
            {settings.cartUrl ? (
              <a className="cart" href={settings.cartUrl} aria-label="Cart">
                <CartIcon />
              </a>
            ) : null}
            {settings.bookingUrl ? (
              <a
                className="btn btn-primary"
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.bookingLabel ?? 'Book Now'}
              </a>
            ) : null}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <Hero home={home} settings={settings} slideUrls={slideUrls} />

      {/* ===== TRUST STRIP ===== */}
      {home.trustItems?.length ? (
        <div className="trust">
          <div className="wrap">
            {home.trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      ) : null}

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
            {services.map((s) => (
              <a className="svc" key={s._id} href={s.link ?? settings.bookingUrl ?? '#'}>
                <div className="ic">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <div className="pr">{servicePrice(s)}</div>
              </a>
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
            {products.map((p) => (
              <a className="prod" key={p._id} href={p.url ?? '#'}>
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
              <Footnote text={home.reviewsFootnote} />
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

      {/* ===== BOOKING CTA ===== */}
      <section>
        <div className="wrap">
          <div className="book">
            {home.bookingKicker ? <div className="kicker">{home.bookingKicker}</div> : null}
            {home.bookingHeading ? <h2>{home.bookingHeading}</h2> : null}
            {home.bookingSubtitle ? <p>{home.bookingSubtitle}</p> : null}
            {settings.bookingUrl ? (
              <a
                className="btn btn-primary"
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.bookingLabel ?? 'Book Now'}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="location">
        <div className="wrap">
          <div className="f-top">
            <div className="f-brand">
              <div className="emblem">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={settings.logo?.alt ?? settings.brandName ?? 'Logo'}
                    width={70}
                    height={70}
                    style={{height: '86%', width: '86%', objectFit: 'contain'}}
                  />
                ) : null}
              </div>
              {settings.footerBlurb ? <p>{settings.footerBlurb}</p> : null}
            </div>

            <div className="f-col">
              <h4>{settings.footerVisitHeading ?? 'VISIT'}</h4>
              {settings.footerVisitLinks?.map((l) =>
                l?.href ? (
                  <a
                    key={l._key}
                    href={cleanHref(l.href)}
                    {...(l.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                  >
                    {l.label}
                  </a>
                ) : null,
              )}
            </div>

            <div className="f-col">
              <h4>{settings.footerHoursHeading ?? 'HOURS'}</h4>
              {settings.openingHours?.map((row) => (
                <span key={row._key}>
                  {row.days} · {row.hours}
                </span>
              ))}
            </div>

            <div className="f-col">
              <h4>{settings.footerConnectHeading ?? 'CONNECT'}</h4>
              {settings.footerConnectLinks?.map((l) =>
                l?.href ? (
                  <a
                    key={l._key}
                    href={cleanHref(l.href)}
                    {...(l.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                  >
                    {l.label}
                  </a>
                ) : null,
              )}
            </div>
          </div>

          {settings.legalLine ? <div className="legal">{settings.legalLine}</div> : null}
        </div>
      </footer>
    </>
  )
}
