import {SocialIcon} from './icons'

type SocialLink = {_key: string; platform: string; url: string}

/** Fixed to the lower-left corner of every page, driven entirely by the CMS. */
export function FloatingSocial({links}: {links: SocialLink[]}) {
  if (!links.length) return null

  return (
    <div className="floating-social">
      {links.map((s) => (
        <a
          key={s._key}
          href={s.platform === 'phone' ? `tel:${s.url.replace(/\s/g, '')}` : s.url}
          aria-label={s.platform}
          {...(s.platform === 'phone' ? {} : {target: '_blank', rel: 'noopener noreferrer'})}
        >
          <SocialIcon platform={s.platform} />
        </a>
      ))}
    </div>
  )
}
