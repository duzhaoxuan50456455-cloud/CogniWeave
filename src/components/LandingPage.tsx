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
          <h2 className="landing__card-title">Chat View</h2>
        </button>
        <button type="button" className="landing__card" onClick={onOpenTreePreview}>
          <h2 className="landing__card-title">Tree View</h2>
        </button>
      </div>
    </main>
  )
}
