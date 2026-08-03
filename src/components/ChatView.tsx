import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react'
import type { Contribution } from '../types/discussion'

type ChatViewProps = {
  topic: string
  messages: Contribution[]
  messageDraft: string
  onMessageDraftChange: (value: string) => void
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void
  onBack: () => void
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
  onMessageDraftChange,
  onSendMessage,
  onBack,
}: ChatViewProps) {
  const threadEndRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    const textarea = composerRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
  }, [messageDraft])

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (messageDraft.trim()) event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="chat-shell">
      <header className="discussion-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Go back">
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
        <button type="button" className="icon-button" aria-label="Conversation options">•••</button>
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
                  <div className="chat-message__bubble">
                    <p>{message.body}</p>
                  </div>
                </div>
                {isYou && !joinsNext && (
                  <div className="avatar avatar--you" aria-label="Your avatar">YO</div>
                )}
                {isYou && joinsNext && <div className="avatar-spacer" aria-hidden="true" />}
              </article>
            )
          })}

          <div className="typing-row" aria-label="Amy is typing">
            <div className="avatar avatar--small" style={{ background: AVATAR_COLORS.Amy }}>A</div>
            <div className="typing-bubble" aria-hidden="true"><i /><i /><i /></div>
            <span>Amy is typing</span>
          </div>
          <div ref={threadEndRef} />
        </div>
      </main>

      <form className="chat-composer" onSubmit={onSendMessage}>
        <div className="chat-composer__inner">
          <button type="button" className="composer-action" aria-label="Add attachment">+</button>
          <textarea
            ref={composerRef}
            rows={1}
            placeholder="Message the discussion…"
            value={messageDraft}
            onChange={(event) => onMessageDraftChange(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            aria-label="Message"
          />
          <button
            type="submit"
            className="send-button"
            disabled={!messageDraft.trim()}
            aria-label="Send message"
          >
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </form>
    </div>
  )
}
