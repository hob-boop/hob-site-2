import type {SectionHeader} from '@/sanity/lib/types'

/** Section header block: kicker, heading, gold rule, optional intro. */
export function SectionHead({header}: {header: SectionHeader}) {
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
