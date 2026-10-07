import { downloadFile } from './logger'
import { getExperimentDiscussion } from './discussions'
import type { ExperimentSession } from './studyTypes'

type ExportPageProps = { session: ExperimentSession; researcherMode: boolean }

function toCsv(session: ExperimentSession): string {
  const header = ['participantId', 'trialIndex', 'topic', 'condition', 'factualAccuracy', 'directRelationAccuracy', 'integrativeAccuracy', 'globalAccuracy', 'overallAccuracy', 'discussionTimeMs', 'questionTimeMs', 'reviewCount', 'reviewTimeMs', 'mentalDemand', 'relationClarity', 'usefulness', 'preference', 'confidence', 'topicFamiliarity']
  const rows = session.trials.map((trial, index) => {
    const timing = trial.timing
    const ratings = trial.ratings
    return [
      session.participantId,
      index + 1,
      trial.assignment.discussionId,
      trial.assignment.condition,
      trial.scores?.factualAccuracy ?? '',
      trial.scores?.directRelationAccuracy ?? '',
      trial.scores?.integrativeAccuracy ?? '',
      trial.scores?.globalReconstructionAccuracy ?? '',
      trial.scores?.overallAccuracy ?? '',
      timing.questionPageStart ? timing.questionPageStart - timing.discussionViewStart : '',
      timing.questionSubmit && timing.questionPageStart ? timing.questionSubmit - timing.questionPageStart - trial.reviewDurationMs : '',
      trial.reviewCount,
      trial.reviewDurationMs,
      ratings?.mentalDemand ?? '',
      ratings?.relationClarity ?? '',
      ratings?.usefulness ?? '',
      ratings?.preference ?? '',
      ratings?.confidence ?? '',
      ratings?.topicFamiliarity ?? '',
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')
  })
  return [header.join(','), ...rows].join('\n')
}

function interactionSummary(session: ExperimentSession, discussionId: string) {
  const events = session.events.filter((event) => event.discussionId === discussionId)
  const count = (type: string) => events.filter((event) => event.type === type).length
  return { chatClicks: count('chat_message_click'), mapClicks: count('map_node_click'), chatToMap: count('chat_to_map'), mapToChat: count('map_to_chat') }
}

export function ExportPage({ session, researcherMode }: ExportPageProps) {
  const safeParticipantId = session.participantId.replace(/[^a-z0-9_-]/gi, '_') || 'participant'
  const exportData = {
    participantId: session.participantId,
    assignedConditionOrder: session.assignedTrialSequence.map((trial) => trial.condition),
    topicConditionAssignment: session.assignedTrialSequence,
    assignedTrialSequence: session.assignedTrialSequence,
    trials: session.trials.map((trial) => ({
      discussionId: trial.assignment.discussionId,
      condition: trial.assignment.condition,
      answers: trial.answers,
      questionTypes: getExperimentDiscussion(trial.assignment.discussionId).questions.map((question) => question.type),
      scores: trial.scores,
      ratings: trial.ratings,
      timing: trial.timing,
      reviewCount: trial.reviewCount,
      reviewDurationMs: trial.reviewDurationMs,
      interactions: interactionSummary(session, trial.assignment.discussionId),
    })),
    finalQuestionnaire: session.finalQuestionnaire,
    backgroundVariables: session.backgroundVariables,
    events: session.events,
  }

  return (
    <main className="study-page">
      <section className="study-card study-card--complete">
        <span className="study-kicker">Study complete</span>
        <h1>Thank you</h1>
        <p className="study-intro">Your session is complete.</p>
        {researcherMode && <div className="study-researcher-export"><button type="button" className="study-primary" onClick={() => downloadFile(`cogniweave-${safeParticipantId}.json`, JSON.stringify(exportData, null, 2), 'application/json')}>Download JSON data</button><button type="button" className="study-secondary" onClick={() => downloadFile(`cogniweave-${safeParticipantId}-trials.csv`, toCsv(session), 'text/csv')}>Download CSV summary</button></div>}
      </section>
    </main>
  )
}
