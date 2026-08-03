type ModeSelectionProps = {
  topic: string
  onBack: () => void
  onTalk: () => void
  onOrganize: () => void
  onHelpChoose: () => void
}

export function ModeSelection({
  topic,
  onBack,
  onTalk,
  onOrganize,
  onHelpChoose,
}: ModeSelectionProps) {
  return (
    <main className="mode-selection">
      <div className="mode-selection__toolbar">
        <button type="button" className="shell-header__back" onClick={onBack}>
          Back
        </button>
      </div>

      <header className="mode-selection__header">
        <span className="mode-selection__eyebrow">Discussion setup</span>
        <h1 className="mode-selection__title">Choose how to discuss</h1>
        <p className="mode-selection__subtitle">{topic}</p>
      </header>

      <ul className="mode-selection__list">
        <li>
          <button type="button" className="mode-option" onClick={onTalk}>
            <span className="mode-option__icon" aria-hidden="true">💬</span>
            <span className="mode-option__copy"><h2 className="mode-option__title">Talk it through</h2>
            <p className="mode-option__description">
              Fast, chronological conversation
            </p></span><span className="mode-option__arrow" aria-hidden="true">→</span>
          </button>
        </li>
        <li>
          <button type="button" className="mode-option" onClick={onOrganize}>
            <span className="mode-option__icon" aria-hidden="true">⑂</span>
            <span className="mode-option__copy"><h2 className="mode-option__title">Organize ideas</h2>
            <p className="mode-option__description">
              Visual, structured discussion
            </p></span><span className="mode-option__arrow" aria-hidden="true">→</span>
          </button>
        </li>
        <li>
          <button type="button" className="mode-option" onClick={onHelpChoose}>
            <span className="mode-option__icon" aria-hidden="true">✦</span>
            <span className="mode-option__copy"><h2 className="mode-option__title">Help me choose</h2>
            <p className="mode-option__description">
              Answer three short questions
            </p></span><span className="mode-option__arrow" aria-hidden="true">→</span>
          </button>
        </li>
      </ul>
    </main>
  )
}
