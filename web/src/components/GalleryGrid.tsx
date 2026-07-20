'use client'

import {useCallback, useEffect, useState} from 'react'
import Image from 'next/image'
import type {SanityImage} from '@/sanity/lib/types'
import {Reveal} from './Reveal'

type Props = {
  images: (SanityImage & {_key: string})[]
}

export function GalleryGrid({images}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, close, step])

  const open = openIndex !== null ? images[openIndex] : null

  return (
    <>
      <div className="work-grid">
        {images.map((img, i) =>
          img?.url ? (
            <Reveal key={img._key} delay={(i % 6) * 60} className="work-grid-item">
              <button
                type="button"
                className="frame"
                onClick={() => setOpenIndex(i)}
                aria-label={`View photo ${i + 1} full size`}
              >
                <div className="ph">
                  <Image
                    src={img.url}
                    alt={img.alt ?? 'Our work'}
                    width={480}
                    height={640}
                    sizes="(max-width: 620px) 46vw, (max-width: 980px) 30vw, 22vw"
                    placeholder={img.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.lqip ?? undefined}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
              </button>
            </Reveal>
          ) : null,
        )}
      </div>

      {open?.url ? (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
            &times;
          </button>
          <button
            type="button"
            className="lightbox-arrow prev"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
          <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <Image
              src={open.url}
              alt={open.alt ?? 'Our work'}
              width={1000}
              height={1250}
              sizes="90vw"
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
              priority
            />
          </div>
          <button
            type="button"
            className="lightbox-arrow next"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </div>
      ) : null}
    </>
  )
}
