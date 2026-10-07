import type { TrialAssignment } from './experimentConfig'
import type { FinalQuestionnaireResponse } from './studyTypes'

type FinalQuestionnaireProps = {
  value: FinalQuestionnaireResponse
  assignments: TrialAssignment[]
  onChange: (value: FinalQuestionnaireResponse) => void
  onSubmit: () => void
}

export function FinalQuestionnaire({ value, assignments, onChange, onSubmit }: FinalQuestionnaireProps) {
  const questions: ReadonlyArray<{ key: keyof Omit<FinalQuestionnaireResponse, 'comments'>; prompt: string }> = [
    { key: 'preferredCondition', prompt: 'Which interface did you prefer overall?' },
    { key: 'bestPerformanceCondition', prompt: 'Which interface do you think helped you perform best?' },
    { key: 'easiestCondition', prompt: 'Which interface felt easiest to understand?' },
    { key: 'mostUsefulCondition', prompt: 'Which interface felt most useful?' },
  ]
  const complete = questions.every(({ key }) => value[key] !== null)

  return (
    <main className="study-page">
      <section className="study-card">
        <span className="study-kicker">Final questions</span>
        <h1>Reflect on the discussion views</h1>
        <div className="study-ratings">
          {questions.map(({ key, prompt }) => (
            <fieldset key={key} className="study-rating">
              <legend>{prompt}</legend>
              <div className="study-condition-options">
                {assignments.map((assignment, index) => (
                  <label key={assignment.condition} className={value[key] === assignment.condition ? 'study-option study-option--selected' : 'study-option'}>
                    <input type="radio" name={key} checked={value[key] === assignment.condition} onChange={() => onChange({ ...value, [key]: assignment.condition })} />
                    <span>{['First', 'Second', 'Third'][index]} interface</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <label className="study-textarea">
            <span>What did you find most helpful or distracting? <small>Optional</small></span>
            <textarea value={value.comments} onChange={(event) => onChange({ ...value, comments: event.target.value })} />
          </label>
        </div>
        <div className="study-placeholder">Need for Cognition questionnaire — to be added after protocol review.</div>
        <button type="button" className="study-primary" disabled={!complete} onClick={onSubmit}>Complete study</button>
      </section>
    </main>
  )
}
