import type { TrialRatings } from './studyTypes'

type RatingItem = keyof TrialRatings

const RATING_PROMPTS: ReadonlyArray<{ id: RatingItem; prompt: string; low: string; high: string }> = [
  { id: 'mentalDemand', prompt: 'How mentally demanding was it to understand this discussion?', low: 'Not demanding', high: 'Very demanding' },
  { id: 'relationClarity', prompt: 'How easy was it to understand how the ideas were related?', low: 'Very difficult', high: 'Very easy' },
  { id: 'usefulness', prompt: 'How useful was the interface for understanding the discussion?', low: 'Not useful', high: 'Very useful' },
  { id: 'preference', prompt: 'How much did you like using this interface?', low: 'Not at all', high: 'Very much' },
  { id: 'confidence', prompt: 'How confident are you that your answers were correct?', low: 'Not confident', high: 'Very confident' },
  { id: 'topicFamiliarity', prompt: 'Before this study, how familiar were you with this discussion topic?', low: 'Not familiar', high: 'Very familiar' },
]

type RatingPageProps = {
  value: Partial<TrialRatings>
  onChange: (ratings: Partial<TrialRatings>) => void
  onSubmit: (ratings: TrialRatings) => void
}

export function RatingPage({ value, onChange, onSubmit }: RatingPageProps) {
  const complete = RATING_PROMPTS.every(({ id }) => value[id] !== undefined)

  return (
    <main className="study-page">
      <section className="study-card">
        <span className="study-kicker">Your experience</span>
        <h1>Rate this discussion view</h1>
        <p className="study-intro">There are no right answers. Please rate the discussion you just completed.</p>
        <div className="study-ratings">
          {RATING_PROMPTS.map(({ id, prompt, low, high }) => (
            <fieldset key={id} className="study-rating">
              <legend>{prompt}</legend>
              <div className="study-scale" role="radiogroup" aria-label={prompt}>
                {[1, 2, 3, 4, 5, 6, 7].map((ratingValue) => (
                  <label key={ratingValue} className={value[id] === ratingValue ? 'study-scale__item study-scale__item--selected' : 'study-scale__item'}>
                    <input type="radio" name={id} checked={value[id] === ratingValue} onChange={() => onChange({ ...value, [id]: ratingValue })} />
                    {ratingValue}
                  </label>
                ))}
              </div>
              <div className="study-scale__labels"><span>{low}</span><span>{high}</span></div>
            </fieldset>
          ))}
        </div>
        <button type="button" className="study-primary" disabled={!complete} onClick={() => onSubmit(value as TrialRatings)}>Continue</button>
      </section>
    </main>
  )
}
