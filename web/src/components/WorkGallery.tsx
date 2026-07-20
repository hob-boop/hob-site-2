'use client'

import {useRef} from 'react'
import Image from 'next/image'
import type {SanityImage} from '@/sanity/lib/types'

type Props = {
  images: (SanityImage & {_key: string})[]
}

export function WorkGallery({images}: Props) {
  const rowRef = useRef<HTMLDivElement>(null)

  const scrollBy = (amount: number) => {
    rowRef.current?.scrollBy({left: amount, behavior: 'smooth'})
  }

  return (
    <>
      <div className="row" id="workRow" ref={rowRef}>
        {images.map((img) =>
          img?.url ? (
            <div className="frame" key={img._key}>
              <div className="ph">
                <Image
                  src={img.url}
                  alt={img.alt ?? 'Our work'}
                  width={240}
                  height={320}
                  sizes="240px"
                  placeholder={img.lqip ? 'blur' : 'empty'}
                  blurDataURL={img.lqip ?? undefined}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
            </div>
          ) : null,
        )}
      </div>
      <div className="nav">
        <button type="button" onClick={() => scrollBy(-520)} aria-label="Scroll gallery left">
          &#8249;
        </button>
        <button type="button" onClick={() => scrollBy(520)} aria-label="Scroll gallery right">
          &#8250;
        </button>
      </div>
    </>
  )
}
