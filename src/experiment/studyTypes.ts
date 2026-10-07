import type { ExperimentalCondition, TrialAssignment } from './experimentConfig'
import type { ExperimentEvent } from './logger'

export type QuestionType = 'factual' | 'direct-relation' | 'integrative' | 'global-reconstruction'

export type TrialTiming = {
  trialStart: number
  discussionViewStart: number
  questionPageStart?: number
  questionSubmit?: number
  ratingSubmit?: number
  trialEnd?: number
}

export type TrialRatings = {
  mentalDemand: number
  relationClarity: number
  usefulness: number
  preference: number
  confidence: number
  topicFamiliarity: number
}

export type TrialScores = {
  factualAccuracy: number
  directRelationAccuracy: number
  integrativeAccuracy: number
  globalReconstructionAccuracy: number
  overallAccuracy: number
}

export type TrialRecord = {
  assignment: TrialAssignment
  answers: Array<number | null>
  scores?: TrialScores
  ratings?: TrialRatings
  timing: TrialTiming
  reviewCount: number
  reviewDurationMs: number
  reviewStartedAt?: number
}

export type FinalQuestionnaireResponse = {
  preferredCondition: ExperimentalCondition | null
  bestPerformanceCondition: ExperimentalCondition | null
  easiestCondition: ExperimentalCondition | null
  mostUsefulCondition: ExperimentalCondition | null
  comments: string
}

export type BackgroundVariables = {
  mindMapFamiliarity: number | null
  threadedDiscussionFamiliarity: number | null
  englishReadingProficiency: number | null
}

export type ExperimentSession = {
  participantId: string
  assignedTrialSequence: TrialAssignment[]
  phase: 'instructions' | 'discussion' | 'questions' | 'review' | 'ratings' | 'background' | 'final' | 'export'
  trialIndex: number
  trials: TrialRecord[]
  finalQuestionnaire: FinalQuestionnaireResponse
  backgroundVariables: BackgroundVariables
  events: ExperimentEvent[]
}
