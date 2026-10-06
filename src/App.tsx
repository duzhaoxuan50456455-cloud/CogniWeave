import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { appStyles } from './appStyles'
import { ChatView } from './components/ChatView'
import { LandingPage } from './components/LandingPage'
import { TreeView } from './components/TreeView'
import {
  createId,
  createInitialContributions,
  DISCUSSION_TOPIC,
  sortByCreatedAt,
  type Contribution,
  type DiscussionReturnScreen,
  type ReactionEmoji,
  type ReplyRelation,
  type Screen,
} from './types/discussion'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [returnScreen, setReturnScreen] =
    useState<DiscussionReturnScreen>('landing')
  const [contributions, setContributions] = useState<Contribution[]>(
    createInitialContributions,
  )
  const [messageDraft, setMessageDraft] = useState('')
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [replyRelation, setReplyRelation] = useState<ReplyRelation>('reply')
  const [messageReactions, setMessageReactions] = useState<
    Record<string, ReactionEmoji | undefined>
  >({})
  const [isMapVisible, setIsMapVisible] = useState(true)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [selectionSource, setSelectionSource] = useState<'chat' | 'map' | null>(null)
  const selectionTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (selectionTimerRef.current !== null) {
      window.clearTimeout(selectionTimerRef.current)
    }
  }, [])

  const chatMessages = useMemo(
    () =>
      contributions
        .filter((c) => c.kind === 'message')
        .slice()
        .sort(sortByCreatedAt),
    [contributions],
  )

  const treeContributions = useMemo(
    () =>
      contributions
        .filter((c) => c.kind !== 'message')
        .slice()
        .sort(sortByCreatedAt),
    [contributions],
  )

  function openChat(from: DiscussionReturnScreen) {
    setReturnScreen(from)
    setScreen('chat')
  }

  function goBackFromDiscussion() {
    setScreen(returnScreen)
  }

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = messageDraft.trim()
    if (!body) return

    setContributions((prev) => [
      ...prev,
      {
        id: createId('contrib'),
        kind: 'message',
        author: 'You',
        body,
        parentId: replyToId,
        relation: 'idea',
        createdAt: Date.now(),
        replyToId,
        replyRelation: replyToId ? replyRelation : undefined,
      },
    ])
    setMessageDraft('')
    setReplyToId(null)
    setReplyRelation('reply')
  }

  const handleToggleReaction = useCallback(
    (messageId: string, reaction: ReactionEmoji) => {
      setMessageReactions((current) => ({
        ...current,
        [messageId]: current[messageId] === reaction ? undefined : reaction,
      }))
    },
    [],
  )

  const handleSelectMessage = useCallback((messageId: string, source: 'chat' | 'map') => {
    setSelectedMessageId(messageId)
    setSelectionSource(source)
    if (selectionTimerRef.current !== null) {
      window.clearTimeout(selectionTimerRef.current)
    }
    selectionTimerRef.current = window.setTimeout(() => {
      setSelectedMessageId(null)
      setSelectionSource(null)
      selectionTimerRef.current = null
    }, 2_400)
  }, [])

  const handleUpdateContribution = useCallback(
    (id: string, changes: Pick<Contribution, 'title' | 'body'>) => {
      setContributions((prev) =>
        prev.map((contribution) =>
          contribution.id === id ? { ...contribution, ...changes } : contribution,
        ),
      )
    },
    [],
  )

  const handleAddTreeNode = useCallback(
    (parentId: string | null, title: string, body: string) => {
      const isRoot = parentId === null
      setContributions((prev) => [
        ...prev,
        {
          id: createId('contrib'),
          kind: isRoot ? 'branch' : 'idea',
          author: 'You',
          title: title.trim(),
          body: body.trim(),
          parentId,
          relation: 'idea',
          createdAt: Date.now(),
        },
      ])
    },
    [],
  )

  return (
    <>
      <style>{appStyles}</style>

      {screen === 'landing' && (
        <LandingPage onStartDiscussion={() => openChat('landing')} />
      )}

      {screen === 'chat' && (
        <ChatView
          topic={DISCUSSION_TOPIC}
          messages={chatMessages}
          messageDraft={messageDraft}
          replyToId={replyToId}
          replyRelation={replyRelation}
          reactions={messageReactions}
          isMapVisible={isMapVisible}
          selectedMessageId={selectedMessageId}
          selectionSource={selectionSource}
          onMessageDraftChange={setMessageDraft}
          onReplyToChange={setReplyToId}
          onReplyRelationChange={setReplyRelation}
          onToggleReaction={handleToggleReaction}
          onToggleMap={() => setIsMapVisible((visible) => !visible)}
          onSelectMessage={handleSelectMessage}
          onSendMessage={handleSendMessage}
          onBack={goBackFromDiscussion}
        />
      )}

      {screen === 'tree' && (
        <TreeView
          topic={DISCUSSION_TOPIC}
          contributions={treeContributions}
          onUpdateContribution={handleUpdateContribution}
          onAddNode={handleAddTreeNode}
          onBack={goBackFromDiscussion}
        />
      )}
    </>
  )
}

export default App
