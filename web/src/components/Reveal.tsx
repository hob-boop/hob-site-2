'use client'

import {useEffect, useRef, type ReactNode} from 'react'

type Props = {
  children: ReactNode
  /** Stagger this element's entrance behind its siblings, in milliseconds. */
  delay?: number
  className?: string
  as?: 'div' | 'li'
}

/** Fades and lifts children into place the first time they scroll into view. */
export function Reveal({children, delay = 0, className, as = 'div'}: Props) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible')
          observer.disconnect()
        }
      },
      {threshold: 0.15, rootMargin: '0px 0px -60px 0px'},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as
  return (
    <Tag ref={ref} className={`reveal${className ? ` ${className}` : ''}`} style={{transitionDelay: `${delay}ms`}}>
      {children}
    </Tag>
  )
}
