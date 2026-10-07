import type { ExperimentalCondition, TrialAssignment } from './experimentConfig'

export type ExperimentEventType =
  | 'trial_start'
  | 'trial_end'
  | 'discussion_view_start'
  | 'continue_to_questions'
  | 'review_open'
  | 'review_close'
  | 'question_answer'
  | 'question_submit'
  | 'rating_submit'
  | 'chat_message_click'
  | 'map_node_click'
  | 'map_preview_open'
  | 'map_preview_close'
  | 'map_view_in_conversation'
  | 'chat_to_map'
  | 'map_to_chat'

export type ExperimentEvent = {
  participantId: string
  discussionId: string
  condition: ExperimentalCondition
  type: ExperimentEventType
  timestamp: number
  payload: Record<string, string | number | boolean | null>
}

export function createEvent(
  participantId: string,
  trial: TrialAssignment,
  type: ExperimentEventType,
  payload: Record<string, string | number | boolean | null> = {},
): ExperimentEvent {
  return {
    participantId,
    discussionId: trial.discussionId,
    condition: trial.condition,
    type,
    timestamp: Date.now(),
    payload,
  }
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
