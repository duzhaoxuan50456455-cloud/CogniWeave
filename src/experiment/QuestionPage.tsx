import type { ExperimentDiscussion } from './discussions'

type QuestionPageProps = {
  discussion: ExperimentDiscussion
  answers: Array<number | null>
  onAnswer: (questionIndex: number, answerIndex: number) => void
  onSubmit: () => void
  onReview: () => void
}

export function QuestionPage({ discussion, answers, onAnswer, onSubmit, onReview }: QuestionPageProps) {
  const complete = answers.every((answer) => answer !== null)

  return (
    <main className="study-page">
      <section className="study-card">
        <span className="study-kicker">Discussion questions</span>
        <h1>{discussion.title}</h1>
        <p className="study-intro">Answer from the discussion you just read. Choose the best response for each question.</p>
        <div className="study-questions">
          {discussion.questions.map((question, questionIndex) => (
            <fieldset key={question.id} className="study-question">
              <legend>{questionIndex + 1}. {question.prompt}</legend>
              {question.options.map((option, optionIndex) => (
                <label key={option} className={answers[questionIndex] === optionIndex ? 'study-option study-option--selected' : 'study-option'}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[questionIndex] === optionIndex}
                    onChange={() => onAnswer(questionIndex, optionIndex)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className="study-actions">
          <button type="button" className="study-secondary" onClick={onReview}>Review discussion</button>
          <button type="button" className="study-primary" disabled={!complete} onClick={onSubmit}>Continue to ratings</button>
        </div>
      </section>
    </main>
  )
}
