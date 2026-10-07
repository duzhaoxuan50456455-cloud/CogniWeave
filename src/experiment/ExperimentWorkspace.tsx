import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatView } from '../components/ChatView'
import type { ExperimentDiscussion } from './discussions'
import { GroupedConversationMap } from './GroupedConversationMap'
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
  const [selectionSource, setSelectionSource] = useState<'chat' | 'map' | 'map-preview' | null>(null)
  const selectionTimerRef = useRef<number | null>(null)
  const presentation = getConditionPresentation(trial.condition)

  useEffect(() => () => {
    if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current)
  }, [])

  const clearSelectionTimer = useCallback(() => {
    if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current)
  }, [])

  const handleChatSelect = useCallback((messageId: string) => {
    setSelectedMessageId(messageId)
    setSelectionSource('chat')
    clearSelectionTimer()
    selectionTimerRef.current = window.setTimeout(() => {
      setSelectedMessageId(null)
      setSelectionSource(null)
      selectionTimerRef.current = null
    }, 2_400)
    onEvent('chat_message_click', { messageId, context: reviewMode ? 'review' : 'discussion' })
    if (presentation.showMap) onEvent('chat_to_map', { messageId, context: reviewMode ? 'review' : 'discussion' })
  }, [clearSelectionTimer, onEvent, presentation.showMap, reviewMode])

  const handleMapPreviewOpen = useCallback((messageId: string) => {
    clearSelectionTimer()
    setSelectedMessageId(messageId)
    setSelectionSource('map-preview')
    onEvent('map_node_click', { nodeId: messageId, context: reviewMode ? 'review' : 'discussion' })
    onEvent('map_preview_open', { messageId, context: reviewMode ? 'review' : 'discussion' })
  }, [clearSelectionTimer, onEvent, reviewMode])

  const handleMapPreviewClose = useCallback((messageId: string) => {
    setSelectedMessageId(null)
    setSelectionSource(null)
    onEvent('map_preview_close', { messageId, context: reviewMode ? 'review' : 'discussion' })
  }, [onEvent, reviewMode])

  const handleMapViewInConversation = useCallback((messageId: string) => {
    clearSelectionTimer()
    setSelectedMessageId(messageId)
    setSelectionSource('map')
    selectionTimerRef.current = window.setTimeout(() => {
      setSelectedMessageId(null)
      setSelectionSource(null)
      selectionTimerRef.current = null
    }, 2_400)
    onEvent('map_view_in_conversation', { messageId, context: reviewMode ? 'review' : 'discussion' })
    onEvent('map_to_chat', { nodeId: messageId, context: reviewMode ? 'review' : 'discussion' })
  }, [clearSelectionTimer, onEvent, reviewMode])

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
      onSelectMessage={(messageId) => handleChatSelect(messageId)}
      onSendMessage={(event) => event.preventDefault()}
      onBack={() => undefined}
      showReplyContext={presentation.showReplyContext}
      showRelationLabels={presentation.showRelationLabels}
      researchReadOnly
      onContinueToQuestions={onContinue}
      researchContinueLabel={reviewMode ? 'Return to questions' : 'Continue to questions'}
      researchLayout
      mapContent={presentation.showMap ? <GroupedConversationMap
        messages={discussion.messages}
        selectedMessageId={selectedMessageId}
        focusSelectedMessage={selectionSource === 'chat'}
        onPreviewOpen={handleMapPreviewOpen}
        onPreviewClose={handleMapPreviewClose}
        onViewInConversation={handleMapViewInConversation}
      /> : undefined}
    />
  )
}
