import type {Settings, Service} from '@/sanity/lib/types'
import {SiteHeader} from './SiteHeader'
import {SiteFooter} from './SiteFooter'
import {PageHero} from './PageHero'
import {ServiceIcon} from './icons'
import {ServicePrice} from './ServicePrice'

type Props = {
  settings: NonNullable<Settings>
  activeHref: string
  kicker: string
  heading: string
  subtitle: string
  crumb: string
  /** The matching line item from the services list, when one exists. */
  service?: Service
  /** Shown instead of a service card when there's no exact matching SKU yet. */
  fallbackNote?: string
  paragraphs: string[]
}

export function ServiceSpoke({
  settings,
  activeHref,
  kicker,
  heading,
  subtitle,
  crumb,
  service,
  fallbackNote,
  paragraphs,
}: Props) {
  return (
    <>
      <SiteHeader settings={settings} activeHref={activeHref} />

      <PageHero kicker={kicker} heading={heading} subtitle={subtitle} crumb={crumb} />

      <section>
        <div className="wrap" style={{maxWidth: 720}}>
          {service ? (
            <a className="svc" href={service.link ?? settings.bookingUrl ?? '#'} style={{marginBottom: 'var(--sp6)'}}>
              <div className="ic">
                <ServiceIcon name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="pr">
                <ServicePrice service={service} />
              </div>
            </a>
          ) : fallbackNote ? (
            <p className="badge-soft" style={{marginBottom: 'var(--sp6)', display: 'inline-block'}}>
              {fallbackNote}
            </p>
          ) : null}

          {paragraphs.map((p) => (
            <p key={p.slice(0, 40)} style={{color: 'var(--slate)', fontSize: 17, marginBottom: 'var(--sp4)'}}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="book">
            <div className="kicker">Ready when you are</div>
            <h2>Book your next visit</h2>
            <p>Walk-ins welcome at both our Christchurch locations, or book ahead online.</p>
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

      <SiteFooter settings={settings} />
    </>
  )
}
