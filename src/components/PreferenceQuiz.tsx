import { useMemo, useState } from 'react'
import type { RecommendedMode } from '../types/discussion'

type QuizChoice = 'talk' | 'organize'

type QuizOption = {
  mode: QuizChoice
  label: string
  description: string
  icon: string
}

type QuizQuestion = {
  prompt: string
  supportingText: string
  options: [QuizOption, QuizOption]
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    prompt: 'How do your best ideas usually take shape?',
    supportingText: 'Think about what feels natural when a topic is still new.',
    options: [
      { mode: 'talk', icon: '💬', label: 'I think out loud', description: 'The back-and-forth helps me discover what I mean.' },
      { mode: 'organize', icon: '◇', label: 'I map things out', description: 'I understand more when I can arrange ideas first.' },
    ],
  },
  {
    prompt: 'What helps you follow a lively group discussion?',
    supportingText: 'Choose the experience that keeps you most engaged.',
    options: [
      { mode: 'talk', icon: '⚡', label: 'A flowing conversation', description: 'I like responding in the moment as ideas arrive.' },
      { mode: 'organize', icon: '⌘', label: 'A visible structure', description: 'I want to see each thread and how it connects.' },
    ],
  },
  {
    prompt: 'When a discussion gets complex, what do you reach for?',
    supportingText: 'There is no wrong answer—pick what would help today.',
    options: [
      { mode: 'talk', icon: '→', label: 'The conversation history', description: 'A clear timeline lets me retrace how we got here.' },
      { mode: 'organize', icon: '⑂', label: 'A visual overview', description: 'Branches and connections help me see the whole picture.' },
    ],
  },
]

type PreferenceQuizProps = {
  onBack: () => void
  onUseRecommended: (mode: RecommendedMode) => void
  onChooseAnother: () => void
}

export function PreferenceQuiz({ onBack, onUseRecommended, onChooseAnother }: PreferenceQuizProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<QuizChoice | undefined>>([])
  const isComplete = stepIndex === QUIZ_QUESTIONS.length
  const selectedAnswer = answers[stepIndex]

  const recommendedMode = useMemo<RecommendedMode>(() => {
    const organizeScore = answers.filter((answer) => answer === 'organize').length
    return organizeScore >= 2 ? 'organize' : 'talk'
  }, [answers])

  function chooseAnswer(choice: QuizChoice) {
    setAnswers((current) => {
      const next = [...current]
      next[stepIndex] = choice
      return next
    })
  }

  function goPrevious() {
    if (stepIndex === 0) onBack()
    else setStepIndex((current) => current - 1)
  }

  function goNext() {
    if (selectedAnswer) setStepIndex((current) => current + 1)
  }

  const resultIsTree = recommendedMode === 'organize'

  return (
    <main className="preference-quiz">
      <div className="quiz-topbar">
        <button type="button" className="quiz-back" onClick={isComplete ? onBack : goPrevious}>← Back</button>
        <span className="quiz-brand"><span>C</span> CogniWeave</span>
        <span className="quiz-topbar__spacer" />
      </div>

      {!isComplete ? (
        <section className="quiz-card" aria-labelledby="quiz-question">
          <div className="quiz-progress-row">
            <span>Question {stepIndex + 1} of {QUIZ_QUESTIONS.length}</span>
            <span>{Math.round(((stepIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="quiz-progress-track"><span style={{ width: `${((stepIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
          <div className="quiz-copy">
            <span className="quiz-kicker">Find your flow</span>
            <h1 id="quiz-question">{QUIZ_QUESTIONS[stepIndex].prompt}</h1>
            <p>{QUIZ_QUESTIONS[stepIndex].supportingText}</p>
          </div>
          <div className="quiz-options">
            {QUIZ_QUESTIONS[stepIndex].options.map((option) => (
              <button
                type="button"
                key={option.mode}
                className={`quiz-option${selectedAnswer === option.mode ? ' quiz-option--selected' : ''}`}
                onClick={() => chooseAnswer(option.mode)}
                aria-pressed={selectedAnswer === option.mode}
              >
                <span className="quiz-option__icon" aria-hidden="true">{option.icon}</span>
                <span className="quiz-option__copy"><strong>{option.label}</strong><small>{option.description}</small></span>
                <span className="quiz-option__radio" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button type="button" className="quiz-next" onClick={goNext} disabled={!selectedAnswer}>
            {stepIndex === QUIZ_QUESTIONS.length - 1 ? 'See my recommendation' : 'Next question'} <span>→</span>
          </button>
        </section>
      ) : (
        <section className="quiz-card quiz-result" aria-labelledby="quiz-result-title">
          <div className="quiz-result__icon" aria-hidden="true">{resultIsTree ? '⑂' : '💬'}</div>
          <span className="quiz-kicker">Your recommended mode</span>
          <h1 id="quiz-result-title">{resultIsTree ? 'Tree mode' : 'Talk mode'}</h1>
          <p>
            {resultIsTree
              ? 'You prefer seeing the big picture. Tree mode keeps ideas organized, connected, and easy to revisit.'
              : 'You build clarity through conversation. Talk mode keeps ideas moving in a natural, responsive flow.'}
          </p>
          <div className="quiz-result__traits">
            <span>{resultIsTree ? 'Visual structure' : 'Natural flow'}</span>
            <span>{resultIsTree ? 'Connected ideas' : 'Quick responses'}</span>
            <span>{resultIsTree ? 'Flexible pace' : 'Shared momentum'}</span>
          </div>
          <button type="button" className="quiz-next" onClick={() => onUseRecommended(recommendedMode)}>
            Open {resultIsTree ? 'Tree' : 'Talk'} mode <span>→</span>
          </button>
          <button type="button" className="quiz-alternative" onClick={onChooseAnother}>Choose a different mode</button>
          <small className="quiz-disclaimer">A helpful preference, not a permanent label. Switch modes anytime.</small>
        </section>
      )}
    </main>
  )
}
