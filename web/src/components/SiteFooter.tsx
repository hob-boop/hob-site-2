import Image from 'next/image'
import type {Settings} from '@/sanity/lib/types'
import {cleanHref} from '@/sanity/lib/links'
import {LEGACY_LOGO} from '@/sanity/lib/legacyMedia'

type Props = {
  settings: NonNullable<Settings>
}

export function SiteFooter({settings}: Props) {
  const logoUrl = settings.logo?.url ?? LEGACY_LOGO

  return (
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
  )
}
