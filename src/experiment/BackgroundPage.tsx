import type { BackgroundVariables } from './studyTypes'

type BackgroundPageProps = {
  value: BackgroundVariables
  onChange: (value: BackgroundVariables) => void
  onSubmit: () => void
}

const ITEMS: ReadonlyArray<{ key: keyof BackgroundVariables; prompt: string; low: string; high: string }> = [
  { key: 'mindMapFamiliarity', prompt: 'How familiar are you with mind maps or node-link diagrams?', low: 'Not familiar', high: 'Very familiar' },
  { key: 'threadedDiscussionFamiliarity', prompt: 'How familiar are you with threaded discussion tools?', low: 'Not familiar', high: 'Very familiar' },
  { key: 'englishReadingProficiency', prompt: 'How would you rate your English reading proficiency?', low: 'Basic', high: 'Very strong' },
]

export function BackgroundPage({ value, onChange, onSubmit }: BackgroundPageProps) {
  const complete = ITEMS.every(({ key }) => value[key] !== null)
  return <main className="study-page"><section className="study-card">
    <span className="study-kicker">Background questions</span><h1>A little about your experience</h1>
    <p className="study-intro">Please answer the following before the final questions.</p>
    <div className="study-ratings">{ITEMS.map(({ key, prompt, low, high }) => <fieldset key={key} className="study-rating"><legend>{prompt}</legend>
      <div className="study-scale" role="radiogroup" aria-label={prompt}>{[1, 2, 3, 4, 5, 6, 7].map((rating) => <label key={rating} className={value[key] === rating ? 'study-scale__item study-scale__item--selected' : 'study-scale__item'}><input type="radio" name={key} checked={value[key] === rating} onChange={() => onChange({ ...value, [key]: rating })} />{rating}</label>)}</div>
      <div className="study-scale__labels"><span>{low}</span><span>{high}</span></div></fieldset>)}</div>
    <button type="button" className="study-primary" disabled={!complete} onClick={onSubmit}>Continue</button>
    {/* Need for Cognition and Personal Need for Structure remain protocol-review placeholders. */}
  </section></main>
}
