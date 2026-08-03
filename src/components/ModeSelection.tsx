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
        <h1 className="mode-selection__title">Choose how to discuss</h1>
        <p className="mode-selection__subtitle">{topic}</p>
      </header>

      <ul className="mode-selection__list">
        <li>
          <button type="button" className="mode-option" onClick={onTalk}>
            <h2 className="mode-option__title">Talk it through</h2>
            <p className="mode-option__description">
              Fast, chronological conversation
            </p>
          </button>
        </li>
        <li>
          <button type="button" className="mode-option" onClick={onOrganize}>
            <h2 className="mode-option__title">Organize ideas</h2>
            <p className="mode-option__description">
              Visual, structured discussion
            </p>
          </button>
        </li>
        <li>
          <button type="button" className="mode-option" onClick={onHelpChoose}>
            <h2 className="mode-option__title">Help me choose</h2>
            <p className="mode-option__description">
              Answer three short questions
            </p>
          </button>
        </li>
      </ul>
    </main>
  )
}
