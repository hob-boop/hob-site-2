type Props = {
  kicker?: string | null
  heading: string
  subtitle?: string | null
  crumb: string
}

export function PageHero({kicker, heading, subtitle, crumb}: Props) {
  return (
    <header className="page-hero">
      <div className="wrap">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>{crumb}</span>
        </div>
        {kicker ? <div className="kicker">{kicker}</div> : null}
        <h1>{heading}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </header>
  )
}
