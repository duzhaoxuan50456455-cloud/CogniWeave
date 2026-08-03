import { type FormEvent } from 'react'
import type { Contribution } from '../types/discussion'

type ChatViewProps = {
  topic: string
  messages: Contribution[]
  messageDraft: string
  onMessageDraftChange: (value: string) => void
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void
  onBack: () => void
}

export function ChatView({
  topic,
  messages,
  messageDraft,
  onMessageDraftChange,
  onSendMessage,
  onBack,
}: ChatViewProps) {
  return (
    <div className="app">
      <header className="shell-header">
        <h1 className="shell-header__brand">CogniWeave</h1>
        <button type="button" className="shell-header__back" onClick={onBack}>
          Back
        </button>
      </header>

      <div className="screen-body">
        <p className="topic">
          <span className="topic__label">Discussion topic</span>
          {topic}
        </p>

        <ul className="message-list">
          {messages.map((message) => (
            <li
              key={message.id}
              className={
                message.author === 'You' ? 'message message--you' : 'message'
              }
            >
              <div className="message__meta">
                <p className="message__author">{message.author}</p>
                <p className="message__relation">{message.relation}</p>
              </div>
              <p className="message__text">{message.body}</p>
            </li>
          ))}
        </ul>

        <form className="composer" onSubmit={onSendMessage}>
          <input
            type="text"
            className="composer__input"
            placeholder="Add your message…"
            value={messageDraft}
            onChange={(event) => onMessageDraftChange(event.target.value)}
            aria-label="Message"
          />
          <button type="submit" className="composer__submit">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
