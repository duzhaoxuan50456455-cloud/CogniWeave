import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import type { Contribution, ReactionEmoji } from '../types/discussion'

type ChatViewProps = {
  topic: string
  messages: Contribution[]
  messageDraft: string
  replyToId: string | null
  reactions: Record<string, ReactionEmoji | undefined>
  onMessageDraftChange: (value: string) => void
  onReplyToChange: (messageId: string | null) => void
  onToggleReaction: (messageId: string, reaction: ReactionEmoji) => void
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void
  onBack: () => void
}

const REACTIONS: readonly ReactionEmoji[] = ['👍', '💡', '❓', '❤️']

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
    const minutes = 41 + Math.max(0, Math.floor((createdAt - 1_000) / 1_000))
    return `9:${String(minutes).padStart(2, '0')} AM`
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
  reactions,
  onMessageDraftChange,
  onReplyToChange,
  onToggleReaction,
  onSendMessage,
  onBack,
}: ChatViewProps) {
  const threadEndRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
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

  return (
    <div className="chat-shell">
      <header className="discussion-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Go back" title="Go back">
          <span aria-hidden="true">←</span>
        </button>
        <div className="discussion-header__identity">
          <div className="discussion-header__mark" aria-hidden="true">C</div>
          <div>
            <h1 className="discussion-header__title">CogniWeave</h1>
            <p className="discussion-header__status">
              <span className="status-dot" /> 4 participants online
            </p>
          </div>
        </div>
        <button type="button" className="icon-button" aria-label="Conversation options, coming later" title="Conversation options — coming later" disabled>•••</button>
      </header>

      <main className="chat-main">
        <div className="chat-topic">
          <span className="chat-topic__eyebrow">Today’s discussion</span>
          <h2>{topic}</h2>
          <p>Share a thought, build on an idea, or challenge the group.</p>
        </div>

        <div className="chat-thread" role="log" aria-live="polite" aria-label="Discussion messages">
          <div className="date-divider"><span>Today</span></div>
          {messages.map((message, index) => {
            const isYou = message.author === 'You'
            const joinsPrevious = isGroupedWith(message, messages[index - 1])
            const joinsNext = isGroupedWith(message, messages[index + 1])
            const quotedMessage = message.replyToId ? messagesById.get(message.replyToId) : undefined
            const selectedReaction = reactions[message.id]

            return (
              <article
                key={message.id}
                className={`chat-message${isYou ? ' chat-message--you' : ''}${joinsPrevious ? ' chat-message--continued' : ''}${joinsNext ? ' chat-message--continues' : ''}`}
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
                    <div className="chat-message__actions">
                      <button type="button" onClick={() => { onReplyToChange(message.id); setMessageReactionTarget(null) }} aria-label={`Reply to ${message.author}`} title={`Reply to ${message.author}`}>↩</button>
                      <button
                        type="button"
                        onClick={() => { setComposerMenu(null); setMessageReactionTarget((current) => current === message.id ? null : message.id) }}
                        aria-label={`React to ${message.author}'s message`}
                        title="Add reaction"
                        aria-expanded={messageReactionTarget === message.id}
                      >☺</button>
                    </div>
                    {messageReactionTarget === message.id && (
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
                    <div className="chat-message__bubble">
                      {quotedMessage && (
                        <div className="reply-quote">
                          <strong>{quotedMessage.author}</strong>
                          <span>{quotedMessage.body}</span>
                        </div>
                      )}
                      <p>{message.body}</p>
                    </div>
                  </div>
                  {selectedReaction && (
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
      </main>

      <form className="chat-composer" onSubmit={handleSubmit}>
        {replyTarget && (
          <div className="reply-preview">
            <div><span>Replying to <strong>{replyTarget.author}</strong></span><p>{replyTarget.body}</p></div>
            <button type="button" onClick={() => onReplyToChange(null)} aria-label="Cancel reply" title="Cancel reply">×</button>
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
      </form>
    </div>
  )
}
