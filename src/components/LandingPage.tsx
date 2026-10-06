type LandingPageProps = {
  onStartDiscussion: () => void
}

export function LandingPage({ onStartDiscussion }: LandingPageProps) {
  return (
    <main className="landing">
      <header className="landing__header">
        <span className="landing__eyebrow"><span aria-hidden="true">✦</span> A clearer way to discuss</span>
        <h1 className="landing__title">CogniWeave</h1>
        <p className="landing__subtitle">
          Talk naturally. See the structure when you need it.
        </p>
      </header>

      <button type="button" className="landing__cta" onClick={onStartDiscussion}>
        Start Discussion
      </button>

      <div className="landing__cards">
        <div className="landing__card landing__feature">
          <span className="landing__card-icon" aria-hidden="true">💬</span>
          <h2 className="landing__card-title">Start with conversation</h2>
          <p>Discuss ideas in a familiar, natural flow.</p>
        </div>
        <div className="landing__card landing__feature">
          <span className="landing__card-icon" aria-hidden="true">⑂</span>
          <h2 className="landing__card-title">Reveal the map</h2>
          <p>Revisit connections whenever the discussion gets complex.</p>
        </div>
      </div>
    </main>
  )
}
