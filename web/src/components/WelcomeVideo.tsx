'use client'

import {useState} from 'react'
import Image from 'next/image'
import {PlayIcon} from './icons'
import type {SanityImage} from '@/sanity/lib/types'
import {LEGACY_WELCOME_THUMB} from '@/sanity/lib/legacyMedia'

type Props = {
  thumbnail: SanityImage
  videoId: string | null
  tag: string | null
}

export function WelcomeVideo({thumbnail, videoId, tag}: Props) {
  const [playing, setPlaying] = useState(false)

  // Nothing to embed — show the still on its own rather than a dead play button.
  const canPlay = Boolean(videoId)
  const thumbUrl = thumbnail?.url ?? LEGACY_WELCOME_THUMB

  if (playing && videoId) {
    return (
      <div className="video" id="video" style={{cursor: 'default'}}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={tag ?? 'Video'}
        />
      </div>
    )
  }

  return (
    <div
      className="video"
      id="video"
      onClick={canPlay ? () => setPlaying(true) : undefined}
      onKeyDown={
        canPlay
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setPlaying(true)
              }
            }
          : undefined
      }
      role={canPlay ? 'button' : undefined}
      tabIndex={canPlay ? 0 : undefined}
      aria-label={canPlay ? 'Play video' : undefined}
      style={canPlay ? undefined : {cursor: 'default'}}
    >
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt={thumbnail?.alt ?? ''}
          fill
          sizes="(max-width: 880px) 100vw, 55vw"
          placeholder={thumbnail?.lqip ? 'blur' : 'empty'}
          blurDataURL={thumbnail?.lqip ?? undefined}
          style={{objectFit: 'cover'}}
          priority
        />
      ) : null}
      <div className="veil" />
      {canPlay ? (
        <div className="play">
          <PlayIcon />
        </div>
      ) : null}
      {tag ? <div className="tag">{tag}</div> : null}
    </div>
  )
}
