import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { appStyles } from './appStyles'
import { ChatView } from './components/ChatView'
import { LandingPage } from './components/LandingPage'
import { ModeSelection } from './components/ModeSelection'
import { PreferenceQuiz } from './components/PreferenceQuiz'
import { TreeView } from './components/TreeView'
import {
  createId,
  createInitialContributions,
  DISCUSSION_TOPIC,
  sortByCreatedAt,
  type Contribution,
  type DiscussionReturnScreen,
  type RecommendedMode,
  type ReactionEmoji,
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
  const [messageReactions, setMessageReactions] = useState<
    Record<string, ReactionEmoji | undefined>
  >({})
  const [isMapVisible, setIsMapVisible] = useState(true)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [selectionSource, setSelectionSource] = useState<'chat' | 'map' | null>(null)
  const [quizSession, setQuizSession] = useState(0)
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

  function goLanding() {
    setScreen('landing')
  }

  function goModeSelection() {
    setScreen('mode-selection')
  }

  function openPreferenceQuiz() {
    setQuizSession((n) => n + 1)
    setScreen('preference-quiz')
  }

  function openChat(from: DiscussionReturnScreen) {
    setReturnScreen(from)
    setScreen('chat')
  }

  function openTree(from: DiscussionReturnScreen) {
    setReturnScreen(from)
    setScreen('tree')
  }

  function goBackFromDiscussion() {
    setScreen(returnScreen)
  }

  function openRecommendedMode(mode: RecommendedMode) {
    if (mode === 'talk') {
      openChat('mode-selection')
      return
    }
    openTree('mode-selection')
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
      },
    ])
    setMessageDraft('')
    setReplyToId(null)
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
        <LandingPage
          onStartDiscussion={goModeSelection}
          onOpenChatPreview={() => openChat('landing')}
          onOpenTreePreview={() => openTree('landing')}
        />
      )}

      {screen === 'mode-selection' && (
        <ModeSelection
          topic={DISCUSSION_TOPIC}
          onBack={goLanding}
          onTalk={() => openChat('mode-selection')}
          onOrganize={() => openTree('mode-selection')}
          onHelpChoose={openPreferenceQuiz}
        />
      )}

      {screen === 'preference-quiz' && (
        <PreferenceQuiz
          key={quizSession}
          onBack={goModeSelection}
          onUseRecommended={openRecommendedMode}
          onChooseAnother={goModeSelection}
        />
      )}

      {screen === 'chat' && (
        <ChatView
          topic={DISCUSSION_TOPIC}
          messages={chatMessages}
          messageDraft={messageDraft}
          replyToId={replyToId}
          reactions={messageReactions}
          isMapVisible={isMapVisible}
          selectedMessageId={selectedMessageId}
          selectionSource={selectionSource}
          onMessageDraftChange={setMessageDraft}
          onReplyToChange={setReplyToId}
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
