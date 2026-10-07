export type ExperimentalCondition = 'A' | 'B' | 'C'

export type TrialAssignment = {
  discussionId: string
  condition: ExperimentalCondition
}

export const CONDITION_ORDERS: readonly ExperimentalCondition[][] = [
  ['A', 'B', 'C'],
  ['A', 'C', 'B'],
  ['B', 'A', 'C'],
  ['B', 'C', 'A'],
  ['C', 'A', 'B'],
  ['C', 'B', 'A'],
]

const DISCUSSION_ORDERS = [
  ['education', 'attendance', 'peer-grading'],
  ['education', 'peer-grading', 'attendance'],
  ['attendance', 'education', 'peer-grading'],
  ['attendance', 'peer-grading', 'education'],
  ['peer-grading', 'education', 'attendance'],
  ['peer-grading', 'attendance', 'education'],
] as const

function hashParticipantId(participantId: string): number {
  return [...participantId.trim().toUpperCase()].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    17,
  )
}

export function createTrialSequence(participantId: string): TrialAssignment[] {
  const hash = hashParticipantId(participantId)
  const orderIndex = hash % CONDITION_ORDERS.length
  const conditionOrder = CONDITION_ORDERS[orderIndex]
  // Pair the six topic permutations with condition permutations as a Latin-style
  // rotation: across one complete set, every topic appears twice with each condition.
  const topicOrderIndex = [0, 1, 5, 4, 3, 2][orderIndex]
  const discussionOrder = DISCUSSION_ORDERS[topicOrderIndex]

  return conditionOrder.map((condition, index) => ({
    condition,
    discussionId: discussionOrder[index],
  }))
}

const RESEARCHER_DEMO_CONDITIONS: readonly ExperimentalCondition[] = ['A', 'B', 'C']

export function createResearcherDemoTrialSequence(participantId: string): TrialAssignment[] {
  return createTrialSequence(participantId).map((trial, index) => ({
    ...trial,
    condition: RESEARCHER_DEMO_CONDITIONS[index],
  }))
}

export function getDeveloperAssignmentTable() {
  return ['P001', 'P002', 'P003', 'P004', 'P005', 'P006'].map((participantId) => ({
    participantId,
    assignments: createTrialSequence(participantId),
  }))
}

export function getConditionPresentation(condition: ExperimentalCondition) {
  return {
    showReplyContext: condition !== 'A',
    showRelationLabels: condition !== 'A',
    showMap: condition === 'C',
  }
}
