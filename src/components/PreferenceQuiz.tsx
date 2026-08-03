import { useMemo, useState } from 'react'
import type { RecommendedMode } from '../types/discussion'

type QuizChoice = 'A' | 'B'

type QuizQuestion = {
  prompt: string
  choiceA: string
  choiceB: string
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    prompt: 'When working through a complex idea, what feels more natural?',
    choiceA: 'Expressing ideas as they form',
    choiceB: 'Organizing ideas before sharing them',
  },
  {
    prompt: 'In a fast-moving group conversation, how do you usually feel?',
    choiceA: 'Energized by the back-and-forth',
    choiceB: 'I need more time and structure',
  },
  {
    prompt: 'For a complicated discussion, what helps you understand it?',
    choiceA: 'Reading the conversation chronologically',
    choiceB: 'Seeing how the ideas relate visually',
  },
]

function scoreRecommendation(answers: QuizChoice[]): RecommendedMode {
  const aCount = answers.filter((answer) => answer === 'A').length
  const bCount = answers.length - aCount
  return bCount > aCount ? 'organize' : 'talk'
}

type PreferenceQuizProps = {
  onBack: () => void
  onUseRecommended: (mode: RecommendedMode) => void
  onChooseAnother: () => void
}

export function PreferenceQuiz({
  onBack,
  onUseRecommended,
  onChooseAnother,
}: PreferenceQuizProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizChoice[]>([])

  const isComplete = stepIndex >= QUIZ_QUESTIONS.length
  const recommendedMode = useMemo(
    () => (isComplete ? scoreRecommendation(answers) : null),
    [answers, isComplete],
  )

  function handleChoice(choice: QuizChoice) {
    const nextAnswers = [...answers, choice]
    setAnswers(nextAnswers)
    setStepIndex(nextAnswers.length)
  }

  const resultText =
    recommendedMode === 'organize'
      ? 'You may prefer Organize mode right now.'
      : 'You may prefer Talk mode right now.'

  return (
    <main className="preference-quiz">
      <div className="preference-quiz__toolbar">
        <button type="button" className="shell-header__back" onClick={onBack}>
          Back
        </button>
      </div>

      <header className="preference-quiz__header">
        <h1 className="preference-quiz__title">Help me choose</h1>
        <p className="preference-quiz__subtitle">
          Three quick questions about how you like to discuss.
        </p>
      </header>

      <div className="preference-quiz__panel">
        {!isComplete && (
          <>
            <p className="preference-quiz__progress">
              Question {stepIndex + 1} of {QUIZ_QUESTIONS.length}
            </p>
            <p className="preference-quiz__question">
              {QUIZ_QUESTIONS[stepIndex].prompt}
            </p>
            <ul className="preference-quiz__choices">
              <li>
                <button
                  type="button"
                  className="preference-quiz__choice"
                  onClick={() => handleChoice('A')}
                >
                  <p className="preference-quiz__choice-label">
                    {QUIZ_QUESTIONS[stepIndex].choiceA}
                  </p>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="preference-quiz__choice"
                  onClick={() => handleChoice('B')}
                >
                  <p className="preference-quiz__choice-label">
                    {QUIZ_QUESTIONS[stepIndex].choiceB}
                  </p>
                </button>
              </li>
            </ul>
          </>
        )}

        {isComplete && recommendedMode !== null && (
          <>
            <p className="preference-quiz__result">{resultText}</p>
            <p className="preference-quiz__disclaimer">
              This is a provisional preference check, not a psychological
              assessment.
            </p>
            <div className="preference-quiz__actions">
              <button
                type="button"
                className="preference-quiz__primary"
                onClick={() => onUseRecommended(recommendedMode)}
              >
                Use recommended view
              </button>
              <button
                type="button"
                className="preference-quiz__secondary"
                onClick={onChooseAnother}
              >
                Choose another view
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
