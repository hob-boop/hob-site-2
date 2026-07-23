// Repeated enough times that each half comfortably out-widths any viewport,
// so the loop never runs out of items before the -50% translate wraps.
const REPEATS_PER_HALF = 6

/** The gold band under the hero: an infinite horizontal loop, items joined by a star. */
export function TrustStrip({items}: {items: string[]}) {
  const sequence = (half: number, hidden: boolean) => (
    <span className="trust-seq" aria-hidden={hidden} key={half}>
      {Array.from({length: REPEATS_PER_HALF}, (_, r) =>
        items.map((item, i) => (
          <span className="trust-item" key={`${r}-${i}`}>
            {item}
            <span className="trust-star">★</span>
          </span>
        )),
      )}
    </span>
  )

  return (
    <div className="trust">
      <div className="trust-track">
        {sequence(0, false)}
        {sequence(1, true)}
      </div>
    </div>
  )
}
