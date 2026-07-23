'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'
import type {Settings} from '@/sanity/lib/types'
import {cleanHref} from '@/sanity/lib/links'
import {LEGACY_LOGO} from '@/sanity/lib/legacyMedia'
import {CartIcon} from './icons'
import {useCart} from './CartProvider'

type Props = {
  settings: NonNullable<Settings>
  /** The current route, so the matching nav item can be highlighted. */
  activeHref?: string
}

export function SiteHeader({settings, activeHref}: Props) {
  const logoUrl = settings.logo?.url ?? LEGACY_LOGO
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const {count} = useCart()

  // Close on Escape, lock background scroll while open, and auto-close if the
  // viewport grows past the breakpoint where the burger disappears.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const mq = window.matchMedia('(min-width: 981px)')
    const onResize = () => {
      if (mq.matches) close()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onResize)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onResize)
    }
  }, [open])

  const navLinks = settings.navLinks ?? []

  return (
    <nav className="bar">
      <div className="wrap">
        <div className="nav-start">
          <button
            type="button"
            className={`burger${open ? ' open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <a className="brand" href="/">
            <span className="emblem">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={settings.logo?.alt ?? settings.brandName ?? 'Logo'}
                  width={40}
                  height={40}
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
        </div>

        <div className="links">
          {navLinks.map((l) =>
            l?.href ? (
              <a
                key={l._key}
                href={cleanHref(l.href)}
                className={l.href === activeHref ? 'active' : undefined}
                aria-current={l.href === activeHref ? 'page' : undefined}
                {...(l.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
              >
                {l.label}
              </a>
            ) : null,
          )}
        </div>

        <div className="nav-actions">
          <a className="cart" href="/cart" aria-label={`Cart${count ? `, ${count} items` : ''}`}>
            <CartIcon />
            {count > 0 ? <span className="cart-badge">{count}</span> : null}
          </a>
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

      <div className={`nav-backdrop${open ? ' open' : ''}`} onClick={close} aria-hidden="true" />

      <div id="mobile-nav" className={`mobile-nav${open ? ' open' : ''}`} inert={!open}>
        {navLinks.map((l) =>
          l?.href ? (
            <a
              key={l._key}
              href={cleanHref(l.href)}
              className={l.href === activeHref ? 'active' : undefined}
              aria-current={l.href === activeHref ? 'page' : undefined}
              onClick={close}
              {...(l.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
            >
              {l.label}
            </a>
          ) : null,
        )}
      </div>
    </nav>
  )
}
