import { useState, type FormEvent } from 'react'
import { appStyles } from '../appStyles'
import { BackgroundPage } from './BackgroundPage'
import { ExportPage } from './ExportPage'
import { ExperimentWorkspace } from './ExperimentWorkspace'
import { FinalQuestionnaire } from './FinalQuestionnaire'
import { QuestionPage } from './QuestionPage'
import { RatingPage } from './RatingPage'
import { getExperimentDiscussion, scoreAnswers } from './discussions'
import { createTrialSequence, type ExperimentalCondition, type TrialAssignment } from './experimentConfig'
import { createEvent, type ExperimentEventType } from './logger'
import type { BackgroundVariables, ExperimentSession, TrialRatings, TrialRecord } from './studyTypes'

const STORAGE_KEY = 'cogniweave-experiment-session-v1'
const EXPERIMENT_DISCUSSION_IDS = new Set(['education', 'attendance', 'peer-grading'])
const EXPERIMENT_PHASES = new Set<ExperimentSession['phase']>([
  'instructions', 'discussion', 'questions', 'review', 'ratings', 'background', 'final', 'export',
])

function initialFinalQuestionnaire() {
  return {
    preferredCondition: null,
    bestPerformanceCondition: null,
    easiestCondition: null,
    mostUsefulCondition: null,
    comments: '',
  }
}

function initialBackgroundVariables(): BackgroundVariables {
  return { mindMapFamiliarity: null, threadedDiscussionFamiliarity: null, englishReadingProficiency: null }
}

type SessionLoadResult = {
  session: ExperimentSession | null
  error: string | null
}

function isAssignment(value: unknown): value is TrialAssignment {
  if (!value || typeof value !== 'object') return false
  const assignment = value as TrialAssignment
  return EXPERIMENT_DISCUSSION_IDS.has(assignment.discussionId) &&
    (assignment.condition === 'A' || assignment.condition === 'B' || assignment.condition === 'C')
}

function isTrialRecord(value: unknown): value is TrialRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as TrialRecord
  return isAssignment(record.assignment) && Array.isArray(record.answers) && Boolean(record.timing)
}

function validateSession(value: unknown): SessionLoadResult {
  if (!value || typeof value !== 'object') return { session: null, error: 'Saved experiment data is not an object.' }
  const session = value as ExperimentSession
  if (!session.participantId?.trim() || !EXPERIMENT_PHASES.has(session.phase) ||
    !Array.isArray(session.assignedTrialSequence) || session.assignedTrialSequence.length !== 3 ||
    !session.assignedTrialSequence.every(isAssignment) || !Array.isArray(session.trials) ||
    !session.trials.every(isTrialRecord) || !Array.isArray(session.events) ||
    !session.finalQuestionnaire || typeof session.finalQuestionnaire !== 'object' ||
    !session.backgroundVariables || typeof session.backgroundVariables !== 'object' ||
    !Number.isInteger(session.trialIndex)) {
    return { session: null, error: 'Saved experiment data has an invalid study structure.' }
  }

  const activeTrialPhase = session.phase === 'discussion' || session.phase === 'questions' || session.phase === 'review' || session.phase === 'ratings'
  const expectedTrialCount = activeTrialPhase ? session.trialIndex + 1 : session.phase === 'instructions' ? 0 : 3
  const indexIsValid = session.phase === 'instructions'
    ? session.trialIndex === 0
    : session.trialIndex >= 0 && session.trialIndex < session.assignedTrialSequence.length
  const recordsMatchAssignments = session.trials.every((trial, index) =>
    trial.assignment.discussionId === session.assignedTrialSequence[index]?.discussionId &&
    trial.assignment.condition === session.assignedTrialSequence[index]?.condition &&
    trial.answers.length === getExperimentDiscussion(trial.assignment.discussionId).questions.length &&
    typeof trial.reviewCount === 'number' && typeof trial.reviewDurationMs === 'number',
  )

  if (!indexIsValid || session.trials.length !== expectedTrialCount || !recordsMatchAssignments) {
    return { session: null, error: 'Saved experiment data does not match a valid study step.' }
  }
  return { session, error: null }
}

function loadSession(): SessionLoadResult {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (!value) return { session: null, error: null }
    const result = validateSession(JSON.parse(value))
    if (result.error) {
      console.error('CogniWeave experiment session is invalid.', result.error)
      window.localStorage.removeItem(STORAGE_KEY)
      return { session: null, error: null }
    }
    return result
  } catch (error) {
    console.error('CogniWeave experiment session could not be restored.', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return { session: null, error: null }
  }
}

function saveSession(session: ExperimentSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

function createTrialRecord(assignment: TrialAssignment, timestamp: number): TrialRecord {
  const discussion = getExperimentDiscussion(assignment.discussionId)
  return {
    assignment,
    answers: Array.from({ length: discussion.questions.length }, () => null),
    timing: { trialStart: timestamp, discussionViewStart: timestamp },
    reviewCount: 0,
    reviewDurationMs: 0,
  }
}

type ExperimentAppProps = {
  previewCondition: ExperimentalCondition | null
}

export function ExperimentApp({ previewCondition }: ExperimentAppProps) {
  const [initialSession] = useState<SessionLoadResult>(() => previewCondition
    ? { session: null, error: null }
    : loadSession())
  const [session, setSession] = useState<ExperimentSession | null>(initialSession.session)
  const [sessionError, setSessionError] = useState<string | null>(initialSession.error)
  const [participantId, setParticipantId] = useState('')
  const [isStarting, setIsStarting] = useState(false)
  const [previewPhase, setPreviewPhase] = useState<'discussion' | 'questions' | 'review'>('discussion')
  const [previewAnswers, setPreviewAnswers] = useState<Array<number | null>>(() =>
    Array.from({ length: getExperimentDiscussion('education').questions.length }, () => null),
  )
  const isResearcherMode = new URLSearchParams(window.location.search).get('researcher') === '1'

  function replaceSession(next: ExperimentSession) {
    saveSession(next)
    setSessionError(null)
    setSession(next)
  }

  function resetExperimentSession() {
    window.localStorage.removeItem(STORAGE_KEY)
    setSession(null)
    setSessionError(null)
    setParticipantId('')
    setIsStarting(false)
  }

  function developerReset() {
    if (!isResearcherMode) return null
    return <button type="button" className="study-reset" onClick={resetExperimentSession}>Reset experiment session</button>
  }

  if (previewCondition) {
    const trial: TrialAssignment = { discussionId: 'education', condition: previewCondition }
    const discussion = getExperimentDiscussion(trial.discussionId)
    return (
      <>
        <style>{appStyles}</style>
        <div className="research-preview-banner">Developer preview · condition {previewCondition}</div>
        {previewPhase === 'discussion' && <ExperimentWorkspace
          trial={trial}
          discussion={discussion}
          onEvent={() => undefined}
          onContinue={() => setPreviewPhase('questions')}
        />}
        {previewPhase === 'questions' && <QuestionPage
          discussion={discussion}
          answers={previewAnswers}
          onAnswer={(questionIndex, answerIndex) => setPreviewAnswers((answers) => answers.map((answer, index) => index === questionIndex ? answerIndex : answer))}
          onReview={() => setPreviewPhase('review')}
          onSubmit={() => undefined}
        />}
        {previewPhase === 'review' && <ExperimentWorkspace
          trial={trial}
          discussion={discussion}
          onEvent={() => undefined}
          onContinue={() => setPreviewPhase('questions')}
          reviewMode
        />}
      </>
    )
  }

  function startSession(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    if (session || isStarting) return
    const normalizedId = participantId.trim()
    if (!normalizedId) return
    setIsStarting(true)
    const sequence = createTrialSequence(normalizedId)
    replaceSession({
      participantId: normalizedId,
      assignedTrialSequence: sequence,
      phase: 'instructions',
      trialIndex: 0,
      trials: [],
      finalQuestionnaire: initialFinalQuestionnaire(),
      backgroundVariables: initialBackgroundVariables(),
      events: [],
    })
  }

  function appendEvent(type: ExperimentEventType, payload: Record<string, string | number | boolean | null> = {}) {
    if (!session) return
    const trial = session.assignedTrialSequence[session.trialIndex]
    if (!trial) return
    replaceSession({ ...session, events: [...session.events, createEvent(session.participantId, trial, type, payload)] })
  }

  function startTrial(index: number, currentSession = session) {
    if (!currentSession || currentSession.phase !== 'instructions' || index !== 0 || currentSession.trials.length !== 0) return
    const assignment = currentSession.assignedTrialSequence[index]
    const timestamp = Date.now()
    const next = {
      ...currentSession,
      phase: 'discussion' as const,
      trialIndex: index,
      trials: [...currentSession.trials, createTrialRecord(assignment, timestamp)],
      events: [
        ...currentSession.events,
        createEvent(currentSession.participantId, assignment, 'trial_start'),
        createEvent(currentSession.participantId, assignment, 'discussion_view_start'),
      ],
    }
    replaceSession(next)
  }

  function updateCurrentTrial(updater: (trial: TrialRecord) => TrialRecord, phase = session?.phase) {
    if (!session || phase === undefined) return
    const nextTrials = session.trials.map((trial, index) => index === session.trialIndex ? updater(trial) : trial)
    replaceSession({ ...session, phase, trials: nextTrials })
  }

  function continueToQuestions() {
    if (!session || session.phase !== 'discussion' || !session.trials[session.trialIndex]) return
    const timestamp = Date.now()
    const trial = session.assignedTrialSequence[session.trialIndex]
    const nextTrials = session.trials.map((record, index) => index === session.trialIndex
      ? { ...record, timing: { ...record.timing, questionPageStart: timestamp } }
      : record)
    replaceSession({
      ...session,
      phase: 'questions',
      trials: nextTrials,
      events: [...session.events, createEvent(session.participantId, trial, 'continue_to_questions')],
    })
  }

  function recordAnswer(questionIndex: number, answerIndex: number) {
    if (!session || session.phase !== 'questions' || !session.trials[session.trialIndex]) return
    const trial = session.assignedTrialSequence[session.trialIndex]
    const nextTrials = session.trials.map((record, index) => {
      if (index !== session.trialIndex) return record
      const answers = [...record.answers]
      answers[questionIndex] = answerIndex
      return { ...record, answers }
    })
    replaceSession({
      ...session,
      trials: nextTrials,
      events: [...session.events, createEvent(session.participantId, trial, 'question_answer', { questionIndex, answerIndex })],
    })
  }

  function submitQuestions() {
    if (!session || session.phase !== 'questions' || !session.trials[session.trialIndex]) return
    const discussion = getExperimentDiscussion(session.assignedTrialSequence[session.trialIndex].discussionId)
    const record = session.trials[session.trialIndex]
    const scores = scoreAnswers(discussion, record.answers)
    const timestamp = Date.now()
    const nextTrials = session.trials.map((trial, index) => index === session.trialIndex
      ? { ...trial, scores, timing: { ...trial.timing, questionSubmit: timestamp } }
      : trial)
    replaceSession({
      ...session,
      phase: 'ratings',
      trials: nextTrials,
      events: [...session.events, createEvent(session.participantId, record.assignment, 'question_submit', { correct: scores.overallAccuracy * discussion.questions.length, total: discussion.questions.length })],
    })
  }

  function openReview() {
    if (!session || session.phase !== 'questions') return
    const timestamp = Date.now()
    replaceSession({
      ...session,
      phase: 'review',
      trials: session.trials.map((trial, index) => index === session.trialIndex ? { ...trial, reviewCount: trial.reviewCount + 1, reviewStartedAt: timestamp } : trial),
      events: [...session.events, createEvent(session.participantId, session.assignedTrialSequence[session.trialIndex], 'review_open')],
    })
  }

  function closeReview() {
    if (!session || session.phase !== 'review') return
    const timestamp = Date.now()
    const current = session.trials[session.trialIndex]
    if (!current) return
    const duration = current.reviewStartedAt ? timestamp - current.reviewStartedAt : 0
    replaceSession({
      ...session,
      phase: 'questions',
      trials: session.trials.map((trial, index) => index === session.trialIndex ? { ...trial, reviewDurationMs: trial.reviewDurationMs + duration, reviewStartedAt: undefined } : trial),
      events: [...session.events, createEvent(session.participantId, current.assignment, 'review_close', { durationMs: duration })],
    })
  }

  function updateRatings(ratings: Partial<TrialRatings>) {
    if (session?.phase !== 'ratings') return
    updateCurrentTrial((trial) => ({ ...trial, ratings: ratings as TrialRatings }))
  }

  function submitRatings(ratings: TrialRatings) {
    if (!session || session.phase !== 'ratings' || !session.trials[session.trialIndex]) return
    const timestamp = Date.now()
    const completedTrial = session.trials[session.trialIndex]
    const updatedTrials = session.trials.map((trial, index) => index === session.trialIndex
      ? { ...trial, ratings, timing: { ...trial.timing, ratingSubmit: timestamp, trialEnd: timestamp } }
      : trial)
    const events = [
      ...session.events,
      createEvent(session.participantId, completedTrial.assignment, 'rating_submit'),
      createEvent(session.participantId, completedTrial.assignment, 'trial_end'),
    ]
    const nextIndex = session.trialIndex + 1
    if (nextIndex === session.assignedTrialSequence.length) {
      replaceSession({ ...session, phase: 'background', trials: updatedTrials, events })
      return
    }
    const assignment = session.assignedTrialSequence[nextIndex]
    const nextTrialStart = Date.now()
    replaceSession({
      ...session,
      phase: 'discussion',
      trialIndex: nextIndex,
      trials: [...updatedTrials, createTrialRecord(assignment, nextTrialStart)],
      events: [
        ...events,
        createEvent(session.participantId, assignment, 'trial_start'),
        createEvent(session.participantId, assignment, 'discussion_view_start'),
      ],
    })
  }

  if (!session) {
    return (
      <>
        <style>{appStyles}</style>
        <main className="study-page">
          <section className="study-card study-card--narrow">
            <span className="study-kicker">CogniWeave study</span>
            <h1>Discussion understanding study</h1>
            {sessionError ? (
              <>
                <p className="study-intro">A saved developer session is incomplete or out of date, so it was not resumed.</p>
                <p className="study-note">{sessionError}</p>
                {developerReset()}
              </>
            ) : (
              <form onSubmit={startSession}>
                <p className="study-intro">Enter the participant ID provided by the researcher to begin.</p>
                <label className="study-textarea"><span>Participant ID</span><input value={participantId} onChange={(event) => setParticipantId(event.target.value)} autoComplete="off" /></label>
                <button type="submit" className="study-primary" disabled={!participantId.trim() || isStarting}>Continue</button>
              </form>
            )}
          </section>
        </main>
      </>
    )
  }

  const currentTrial = session.trials[session.trialIndex]
  const currentDiscussion = currentTrial ? getExperimentDiscussion(currentTrial.assignment.discussionId) : null

  return (
    <>
      <style>{appStyles}</style>
      {session.phase === 'instructions' && (
        <main className="study-page"><section className="study-card study-card--narrow">
          <span className="study-kicker">Instructions</span>
          <h1>Read three group discussions</h1>
          <p className="study-intro">Try to understand each discussion and the relationships among the ideas. After each discussion, you will answer comprehension questions and rate your experience.</p>
          <p className="study-note">You may navigate within each discussion, but you will not edit or add messages.</p>
          <button type="button" className="study-primary" onClick={() => startTrial(0)}>Start first discussion</button>
          {developerReset()}
        </section></main>
      )}
      {session.phase === 'discussion' && currentTrial && currentDiscussion && (
        <ExperimentWorkspace
          trial={currentTrial.assignment}
          discussion={currentDiscussion}
          onEvent={appendEvent}
          onContinue={continueToQuestions}
        />
      )}
      {session.phase === 'questions' && currentTrial && currentDiscussion && (
        <QuestionPage discussion={currentDiscussion} answers={currentTrial.answers} onAnswer={recordAnswer} onSubmit={submitQuestions} onReview={openReview} />
      )}
      {session.phase === 'review' && currentTrial && currentDiscussion && (
        <ExperimentWorkspace
          trial={currentTrial.assignment}
          discussion={currentDiscussion}
          onEvent={appendEvent}
          onContinue={closeReview}
          reviewMode
        />
      )}
      {session.phase === 'ratings' && currentTrial && (
        <RatingPage value={currentTrial.ratings ?? {}} onChange={updateRatings} onSubmit={submitRatings} />
      )}
      {session.phase === 'background' && (
        <BackgroundPage value={session.backgroundVariables} onChange={(backgroundVariables) => replaceSession({ ...session, backgroundVariables })} onSubmit={() => replaceSession({ ...session, phase: 'final' })} />
      )}
      {session.phase === 'final' && (
        <FinalQuestionnaire value={session.finalQuestionnaire} assignments={session.assignedTrialSequence} onChange={(finalQuestionnaire) => replaceSession({ ...session, finalQuestionnaire })} onSubmit={() => {
          if (session.phase === 'final') replaceSession({ ...session, phase: 'export' })
        }} />
      )}
      {session.phase === 'export' && <ExportPage session={session} researcherMode={isResearcherMode} />}
      {isResearcherMode && session.phase !== 'instructions' && (
        <div className="study-reset-wrap">{developerReset()}</div>
      )}
    </>
  )
}
