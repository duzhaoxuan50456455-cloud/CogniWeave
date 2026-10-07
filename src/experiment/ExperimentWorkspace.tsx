import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatView } from '../components/ChatView'
import type { ExperimentDiscussion } from './discussions'
import { getConditionPresentation, type TrialAssignment } from './experimentConfig'
import type { ExperimentEventType } from './logger'

type ExperimentWorkspaceProps = {
  trial: TrialAssignment
  discussion: ExperimentDiscussion
  onEvent: (type: ExperimentEventType, payload?: Record<string, string | number | boolean | null>) => void
  onContinue: () => void
  reviewMode?: boolean
}

export function ExperimentWorkspace({
  trial,
  discussion,
  onEvent,
  onContinue,
  reviewMode = false,
}: ExperimentWorkspaceProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [selectionSource, setSelectionSource] = useState<'chat' | 'map' | null>(null)
  const selectionTimerRef = useRef<number | null>(null)
  const presentation = getConditionPresentation(trial.condition)

  useEffect(() => () => {
    if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current)
  }, [])

  const handleSelectMessage = useCallback((messageId: string, source: 'chat' | 'map') => {
    setSelectedMessageId(messageId)
    setSelectionSource(source)
    if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current)
    selectionTimerRef.current = window.setTimeout(() => {
      setSelectedMessageId(null)
      setSelectionSource(null)
      selectionTimerRef.current = null
    }, 2_400)

    if (source === 'chat') {
      onEvent('chat_message_click', { messageId, context: reviewMode ? 'review' : 'discussion' })
      if (presentation.showMap) onEvent('chat_to_map', { messageId, context: reviewMode ? 'review' : 'discussion' })
    } else {
      onEvent('map_node_click', { nodeId: messageId, context: reviewMode ? 'review' : 'discussion' })
      onEvent('map_to_chat', { nodeId: messageId, context: reviewMode ? 'review' : 'discussion' })
    }
  }, [onEvent, presentation.showMap, reviewMode])

  return (
    <ChatView
      topic={discussion.title}
      messages={discussion.messages}
      messageDraft=""
      replyToId={null}
      replyRelation="reply"
      reactions={{}}
      isMapVisible={presentation.showMap}
      selectedMessageId={selectedMessageId}
      selectionSource={selectionSource}
      onMessageDraftChange={() => undefined}
      onReplyToChange={() => undefined}
      onReplyRelationChange={() => undefined}
      onToggleReaction={() => undefined}
      onToggleMap={() => undefined}
      onSelectMessage={handleSelectMessage}
      onSendMessage={(event) => event.preventDefault()}
      onBack={() => undefined}
      showReplyContext={presentation.showReplyContext}
      showRelationLabels={presentation.showRelationLabels}
      researchReadOnly
      onContinueToQuestions={onContinue}
      researchContinueLabel={reviewMode ? 'Return to questions' : 'Continue to questions'}
      researchLayout
    />
  )
}
