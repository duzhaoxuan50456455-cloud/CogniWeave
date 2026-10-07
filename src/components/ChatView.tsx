import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import type { Contribution, ReactionEmoji, ReplyRelation } from '../types/discussion'
import { ConversationMap } from './ConversationMap'

type ChatViewProps = {
  topic: string
  messages: Contribution[]
  messageDraft: string
  replyToId: string | null
  replyRelation: ReplyRelation
  reactions: Record<string, ReactionEmoji | undefined>
  isMapVisible: boolean
  selectedMessageId: string | null
  selectionSource: 'chat' | 'map' | null
  onMessageDraftChange: (value: string) => void
  onReplyToChange: (messageId: string | null) => void
  onReplyRelationChange: (relation: ReplyRelation) => void
  onToggleReaction: (messageId: string, reaction: ReactionEmoji) => void
  onToggleMap: () => void
  onSelectMessage: (messageId: string, source: 'chat' | 'map') => void
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void
  onBack: () => void
  showReplyContext?: boolean
  showRelationLabels?: boolean
  researchReadOnly?: boolean
  onContinueToQuestions?: () => void
  researchContinueLabel?: string
  researchLayout?: boolean
}

const REACTIONS: readonly ReactionEmoji[] = ['👍', '💡', '❓', '❤️']
const REPLY_RELATIONS: readonly ReplyRelation[] = ['reply', 'support', 'challenge', 'question']

const RELATION_LABELS: Record<ReplyRelation, string> = {
  reply: 'Reply',
  support: 'Support',
  challenge: 'Challenge',
  question: 'Question',
}

const AVATAR_COLORS: Record<string, string> = {
  Emily: '#2563eb',
  Jack: '#7c3aed',
  Amy: '#0891b2',
  You: '#1d4ed8',
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatMessageTime(createdAt: number): string {
  if (createdAt < 1_000_000_000_000) {
    const totalMinutes = 9 * 60 + 40 + Math.max(0, Math.floor((createdAt - 1_000) / 60_000))
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    return `${hour > 12 ? hour - 12 : hour}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const date = new Date(createdAt)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  return new Intl.DateTimeFormat(undefined, {
    ...(isToday ? {} : { month: 'short', day: 'numeric' }),
    hour: 'numeric',
    minute: '2-digit',
  }).format(createdAt)
}

function isGroupedWith(message: Contribution, neighbor: Contribution | undefined): boolean {
  return Boolean(
    neighbor &&
    neighbor.author === message.author &&
    Math.abs(neighbor.createdAt - message.createdAt) < 5 * 60 * 1000,
  )
}

export function ChatView({
  topic,
  messages,
  messageDraft,
  replyToId,
  replyRelation,
  reactions,
  isMapVisible,
  selectedMessageId,
  selectionSource,
  onMessageDraftChange,
  onReplyToChange,
  onReplyRelationChange,
  onToggleReaction,
  onToggleMap,
  onSelectMessage,
  onSendMessage,
  onBack,
  showReplyContext = true,
  showRelationLabels = true,
  researchReadOnly = false,
  onContinueToQuestions,
  researchContinueLabel = 'Continue to questions',
  researchLayout = false,
}: ChatViewProps) {
  const threadEndRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const messageRefs = useRef<Record<string, HTMLElement | null>>({})
  const typingTimerRef = useRef<number | null>(null)
  const [composerMenu, setComposerMenu] = useState<'actions' | 'reactions' | null>(null)
  const [messageReactionTarget, setMessageReactionTarget] = useState<string | null>(null)
  const [isTypingVisible, setIsTypingVisible] = useState(false)

  const messagesById = useMemo(
    () => new Map(messages.map((message) => [message.id, message])),
    [messages],
  )
  const replyTarget = replyToId ? messagesById.get(replyToId) : undefined
  const hasOpenPopover = composerMenu !== null || messageReactionTarget !== null

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTypingVisible])

  useEffect(() => {
    if (selectionSource !== 'map' || !selectedMessageId) return
    const thread = threadRef.current
    const message = messageRefs.current[selectedMessageId]
    if (!thread || !message) return

    const threadRect = thread.getBoundingClientRect()
    const messageRect = message.getBoundingClientRect()
    const messageIsVisible =
      messageRect.top >= threadRect.top && messageRect.bottom <= threadRect.bottom
    if (!messageIsVisible) {
      message.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedMessageId, selectionSource])

  useEffect(() => {
    const textarea = composerRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
  }, [messageDraft])

  useEffect(() => {
    if (!hasOpenPopover) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('[data-chat-popover-open="true"]')) {
        setComposerMenu(null)
        setMessageReactionTarget(null)
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setComposerMenu(null)
        setMessageReactionTarget(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [hasOpenPopover])

  useEffect(() => () => {
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current)
  }, [])

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (messageDraft.trim()) event.currentTarget.form?.requestSubmit()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const willSend = Boolean(messageDraft.trim())
    onSendMessage(event)
    if (!willSend) return

    setComposerMenu(null)
    setIsTypingVisible(true)
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current)
    typingTimerRef.current = window.setTimeout(() => {
      setIsTypingVisible(false)
      typingTimerRef.current = null
    }, 1_500)
  }

  function insertComposerReaction(reaction: ReactionEmoji) {
    const separator = messageDraft && !messageDraft.endsWith(' ') ? ' ' : ''
    onMessageDraftChange(`${messageDraft}${separator}${reaction}`)
    setComposerMenu(null)
    requestAnimationFrame(() => composerRef.current?.focus())
  }

  function chooseMessageReaction(messageId: string, reaction: ReactionEmoji) {
    onToggleReaction(messageId, reaction)
    setMessageReactionTarget(null)
  }

  function startReply(messageId: string) {
    onReplyToChange(messageId)
    onReplyRelationChange('reply')
    setMessageReactionTarget(null)
    requestAnimationFrame(() => composerRef.current?.focus())
  }

  return (
    <div className={`chat-shell${researchLayout ? ' chat-shell--research' : ''}`}>
      <header className="discussion-header">
        {!researchReadOnly ? <button type="button" className="icon-button" onClick={onBack} aria-label="Go back" title="Go back">
          <span aria-hidden="true">←</span>
        </button> : <span aria-hidden="true" />}
        <div className="discussion-header__identity">
          <div className="discussion-header__mark" aria-hidden="true">C</div>
          <div>
            <h1 className="discussion-header__title">{researchReadOnly ? 'Read this discussion' : 'CogniWeave'}</h1>
            {!researchReadOnly && <p className="discussion-header__status">
              <span className="status-dot" /> 4 participants online
            </p>}
          </div>
        </div>
        {!researchReadOnly && (
          <button
            type="button"
            className="map-toggle"
            onClick={onToggleMap}
            aria-pressed={isMapVisible}
            aria-label={isMapVisible ? 'Hide conversation map' : 'Show conversation map'}
            title={isMapVisible ? 'Hide map' : 'Show map'}
          >
            <span aria-hidden="true">⌘</span> {isMapVisible ? 'Hide map' : 'Show map'}
          </button>
        )}
      </header>

      <div className={`chat-workspace${isMapVisible ? ' chat-workspace--with-map' : ''}`}>
      <main className="chat-main">
        <div className="chat-topic">
          <span className="chat-topic__eyebrow">Today’s discussion</span>
          <h2>{topic}</h2>
          <p>{researchReadOnly ? 'Review the discussion below and try to understand the ideas and how they relate.' : 'Share a thought, build on an idea, or challenge the group.'}</p>
        </div>

        <div className="chat-thread" ref={threadRef} role="log" aria-live="polite" aria-label="Discussion messages">
          <div className="date-divider"><span>Today</span></div>
          {messages.map((message, index) => {
            const isYou = message.author === 'You'
            const joinsPrevious = isGroupedWith(message, messages[index - 1])
            const joinsNext = isGroupedWith(message, messages[index + 1])
            const explicitParentId = message.replyToId ?? message.parentId
            const quotedMessage = explicitParentId ? messagesById.get(explicitParentId) : undefined
            const messageReplyRelation = message.replyRelation ?? 'reply'
            const selectedReaction = reactions[message.id]

            return (
              <article
                key={message.id}
                ref={(node) => { messageRefs.current[message.id] = node }}
                className={`chat-message${isYou ? ' chat-message--you' : ''}${joinsPrevious ? ' chat-message--continued' : ''}${joinsNext ? ' chat-message--continues' : ''}${selectedMessageId === message.id ? ' chat-message--selected' : ''}`}
              >
                {!isYou && !joinsNext && (
                  <div
                    className="avatar"
                    style={{ background: AVATAR_COLORS[message.author] ?? '#64748b' }}
                    aria-label={`${message.author}'s avatar`}
                  >
                    {initials(message.author)}
                  </div>
                )}
                {!isYou && joinsNext && <div className="avatar-spacer" aria-hidden="true" />}
                <div className="chat-message__content">
                  {!joinsPrevious && <div className="chat-message__meta">
                    <span className="chat-message__author">{isYou ? 'You' : message.author}</span>
                    <time dateTime={new Date(message.createdAt).toISOString()}>{formatMessageTime(message.createdAt)}</time>
                  </div>}
                  <div className="chat-message__bubble-wrap" data-chat-popover-open={messageReactionTarget === message.id}>
                    {!researchReadOnly && <div className="chat-message__actions">
                      <button type="button" onClick={() => startReply(message.id)} aria-label={`Reply to ${message.author}`} title={`Reply to ${message.author}`}>↩</button>
                      <button
                        type="button"
                        onClick={() => { setComposerMenu(null); setMessageReactionTarget((current) => current === message.id ? null : message.id) }}
                        aria-label={`React to ${message.author}'s message`}
                        title="Add reaction"
                        aria-expanded={messageReactionTarget === message.id}
                      >☺</button>
                    </div>}
                    {!researchReadOnly && messageReactionTarget === message.id && (
                      <div className="reaction-picker reaction-picker--message" role="menu" aria-label="Choose a reaction">
                        {REACTIONS.map((reaction) => (
                          <button
                            type="button"
                            role="menuitem"
                            key={reaction}
                            onClick={() => chooseMessageReaction(message.id, reaction)}
                            aria-label={`${selectedReaction === reaction ? 'Remove' : 'Add'} ${reaction} reaction`}
                            title={`${selectedReaction === reaction ? 'Remove' : 'Add'} ${reaction}`}
                            aria-pressed={selectedReaction === reaction}
                          >{reaction}</button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      className="chat-message__bubble"
                      onClick={() => onSelectMessage(message.id, 'chat')}
                      aria-label={`Locate ${message.author}'s message in the conversation map`}
                      title={isMapVisible ? 'Locate in map' : 'Message selected'}
                    >
                      {showReplyContext && quotedMessage && (
                        <div className="reply-quote">
                          <strong>
                            {showRelationLabels && <span className={`reply-relation reply-relation--${messageReplyRelation}`}>
                              {RELATION_LABELS[messageReplyRelation]}
                            </span>}
                            Replying to {quotedMessage.author}
                          </strong>
                          <span>{quotedMessage.body}</span>
                        </div>
                      )}
                      <p>{message.body}</p>
                    </button>
                  </div>
                  {!researchReadOnly && selectedReaction && (
                    <div className="message-reactions">
                      <button
                        type="button"
                        onClick={() => onToggleReaction(message.id, selectedReaction)}
                        aria-label={`Remove ${selectedReaction} reaction`}
                        title={`Remove ${selectedReaction} reaction`}
                      >{selectedReaction} <span>1</span></button>
                    </div>
                  )}
                </div>
                {isYou && !joinsNext && <div className="avatar avatar--you" aria-label="Your avatar">YO</div>}
                {isYou && joinsNext && <div className="avatar-spacer" aria-hidden="true" />}
              </article>
            )
          })}

          {isTypingVisible && (
            <div className="typing-row" aria-label="Amy is typing">
              <div className="avatar avatar--small" style={{ background: AVATAR_COLORS.Amy }}>A</div>
              <div className="typing-bubble" aria-hidden="true"><i /><i /><i /></div>
              <span>Amy is typing</span>
            </div>
          )}
          <div ref={threadEndRef} />
        </div>

      {!researchReadOnly ? <form className="chat-composer" onSubmit={handleSubmit}>
        {replyTarget && (
          <div className="reply-preview">
            <div className="reply-preview__content">
              <span>Replying to <strong>{replyTarget.author}</strong></span>
              <p>{replyTarget.body}</p>
              <div className="reply-relation-selector" role="group" aria-label="Reply relationship">
                <span>Reply as</span>
                {REPLY_RELATIONS.map((relation) => (
                  <button
                    type="button"
                    key={relation}
                    className={`reply-relation reply-relation--${relation}`}
                    onClick={() => onReplyRelationChange(relation)}
                    aria-pressed={replyRelation === relation}
                  >
                    {RELATION_LABELS[relation]}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => { onReplyToChange(null); onReplyRelationChange('reply') }} aria-label="Cancel reply" title="Cancel reply">×</button>
          </div>
        )}
        <div className="chat-composer__inner">
          <div className="composer-action-wrap" data-chat-popover-open={composerMenu !== null}>
            <button
              type="button"
              className="composer-action"
              onClick={() => { setMessageReactionTarget(null); setComposerMenu((current) => current ? null : 'actions') }}
              aria-label="Open message actions"
              title="Message actions"
              aria-expanded={composerMenu !== null}
            >+</button>
            {composerMenu === 'actions' && (
              <div className="composer-popover" role="menu" aria-label="Message actions">
                <button type="button" role="menuitem" disabled aria-label="Attach file, coming later" title="Coming later">
                  <span aria-hidden="true">⌁</span><span>Attach file<small>Coming later</small></span>
                </button>
                <button type="button" role="menuitem" onClick={() => setComposerMenu('reactions')}>
                  <span aria-hidden="true">☺</span><span>Add reaction</span>
                </button>
              </div>
            )}
            {composerMenu === 'reactions' && (
              <div className="reaction-picker reaction-picker--composer" role="menu" aria-label="Add an emoji">
                {REACTIONS.map((reaction) => (
                  <button type="button" role="menuitem" key={reaction} onClick={() => insertComposerReaction(reaction)} aria-label={`Add ${reaction}`} title={`Add ${reaction}`}>{reaction}</button>
                ))}
              </div>
            )}
          </div>
          <textarea
            ref={composerRef}
            rows={1}
            placeholder={replyTarget ? `Reply to ${replyTarget.author}…` : 'Message the discussion…'}
            value={messageDraft}
            onChange={(event) => onMessageDraftChange(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            aria-label="Message"
          />
          <button type="submit" className="send-button" disabled={!messageDraft.trim()} aria-label="Send message" title="Send message">
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </form> : (
        <div className="research-composer">
          <p>Take the time you need before continuing.</p>
          <button type="button" onClick={onContinueToQuestions}>{researchContinueLabel} <span aria-hidden="true">→</span></button>
        </div>
      )}
      </main>
      {isMapVisible && (
        <ConversationMap
          messages={messages}
          selectedMessageId={selectedMessageId}
          focusSelectedMessage={selectionSource === 'chat'}
          onSelectMessage={(messageId) => onSelectMessage(messageId, 'map')}
        />
      )}
      </div>
    </div>
  )
}
