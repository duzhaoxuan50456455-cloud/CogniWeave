import { useCallback, useMemo, useState, type FormEvent } from 'react'
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
  const [quizSession, setQuizSession] = useState(0)

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
        parentId: null,
        relation: 'idea',
        createdAt: Date.now(),
      },
    ])
    setMessageDraft('')
  }

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
          onMessageDraftChange={setMessageDraft}
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
