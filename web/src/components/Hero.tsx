'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {SocialIcon} from './icons'
import type {Home, Settings} from '@/sanity/lib/types'

type HeroProps = {
  home: NonNullable<Home>
  settings: NonNullable<Settings>
  slideUrls: string[]
}

export function Hero({home, settings, slideUrls}: HeroProps) {
  const [index, setIndex] = useState(0)
  const count = slideUrls.length
  const intervalMs = Math.round((home.heroSlideSeconds ?? 4.5) * 1000)

  // Held in a ref so the arrows and dots can restart the timer on click,
  // matching the original behaviour.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (count < 2) return
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs)
  }, [count, intervalMs])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const goTo = (n: number) => {
    setIndex(((n % count) + count) % count)
    startTimer()
  }

  const headlineLines = (home.heroHeadline ?? '').split('\n')

  return (
    <header className="hero" id="top">
      <div className="slides">
        {slideUrls.map((url, n) => (
          <div
            key={url}
            className={`slide${n === index ? ' active' : ''}`}
            style={{backgroundImage: `url('${url}')`}}
            role="presentation"
          />
        ))}
      </div>
      <div className="overlay" />

      <div className="headline-zone">
        {home.heroKicker ? <div className="kicker">{home.heroKicker}</div> : null}
        <h1>
          {headlineLines.map((line, i) => (
            <span key={line + i}>
              {line}
              {i < headlineLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        {home.heroSubtitle ? <p className="sub">{home.heroSubtitle}</p> : null}
        {home.heroBadge ? (
          <div>
            <span className="hero-badge">{home.heroBadge}</span>
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="arrow prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="arrow next"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
          >
            &#8250;
          </button>
        </>
      ) : null}

      {settings.socialLinks?.length ? (
        <div className="social">
          {settings.socialLinks.map((s) => (
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
      ) : null}

      {count > 1 ? (
        <div className="dots">
          {slideUrls.map((url, n) => (
            <button
              key={url}
              type="button"
              className={n === index ? 'active' : undefined}
              onClick={() => goTo(n)}
              aria-label={`Go to slide ${n + 1}`}
            />
          ))}
        </div>
      ) : null}
    </header>
  )
}
