type LandingPageProps = {
  onStartDiscussion: () => void
  onOpenChatPreview: () => void
  onOpenTreePreview: () => void
}

export function LandingPage({
  onStartDiscussion,
  onOpenChatPreview,
  onOpenTreePreview,
}: LandingPageProps) {
  return (
    <main className="landing">
      <header className="landing__header">
        <span className="landing__eyebrow"><span aria-hidden="true">✦</span> Discussions, shaped around you</span>
        <h1 className="landing__title">CogniWeave</h1>
        <p className="landing__subtitle">
          Not everyone thinks through conversation the same way.
        </p>
      </header>

      <button type="button" className="landing__cta" onClick={onStartDiscussion}>
        Start Discussion
      </button>

      <div className="landing__cards">
        <button type="button" className="landing__card" onClick={onOpenChatPreview}>
          <span className="landing__card-icon" aria-hidden="true">💬</span>
          <h2 className="landing__card-title">Chat View</h2>
          <p>Follow ideas as a natural conversation.</p>
        </button>
        <button type="button" className="landing__card" onClick={onOpenTreePreview}>
          <span className="landing__card-icon" aria-hidden="true">⑂</span>
          <h2 className="landing__card-title">Tree View</h2>
          <p>See how thoughts connect and branch.</p>
        </button>
      </div>
    </main>
  )
}
