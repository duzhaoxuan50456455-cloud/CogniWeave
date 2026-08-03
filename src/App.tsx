import { useState, type FormEvent } from 'react'

type Screen = 'landing' | 'chat' | 'tree'

type Message = {
  id: string
  author: string
  text: string
}

type Branch = {
  id: string
  title: string
  ideas: string[]
}

const DISCUSSION_TOPIC = 'How should AI change university education?'

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    author: 'Emily',
    text: 'AI could personalize readings and pacing so students who need more time on fundamentals are not left behind.',
  },
  {
    id: 'msg-2',
    author: 'Jack',
    text: 'I worry about over-reliance—universities should teach when to use AI and when to think without it.',
  },
  {
    id: 'msg-3',
    author: 'Amy',
    text: 'Maybe AI tutors handle drill practice while professors focus on debate, ethics, and creative projects.',
  },
]

const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    title: 'Personalized Learning',
    ideas: ['Adaptive syllabi that adjust to each student’s strengths and gaps.'],
  },
  {
    id: 'branch-2',
    title: 'AI Tutors',
    ideas: ['24/7 tutoring for problem sets with hints instead of full answers.'],
  },
  {
    id: 'branch-3',
    title: 'Academic Integrity',
    ideas: ['Clear policies on disclosure when AI assists writing or coding assignments.'],
  },
]

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [messageDraft, setMessageDraft] = useState('')
  const [branchDraft, setBranchDraft] = useState('')

  function goLanding() {
    setScreen('landing')
  }

  function goChat() {
    setScreen('chat')
  }

  function goTree() {
    setScreen('tree')
  }

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = messageDraft.trim()
    if (!text) return

    setMessages((prev) => [
      ...prev,
      { id: createId('msg'), author: 'You', text },
    ])
    setMessageDraft('')
  }

  function handleAddBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = branchDraft.trim()
    if (!title) return

    setBranches((prev) => [
      ...prev,
      {
        id: createId('branch'),
        title,
        ideas: ['New ideas can grow from this branch.'],
      },
    ])
    setBranchDraft('')
  }

  return (
    <>
      <style>{`
        #root {
          width: 100%;
          max-width: none;
          margin: 0;
          border: none;
          text-align: left;
        }

        .app {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          background: #ffffff;
          color: #0f172a;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .shell-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .shell-header__brand {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e40af;
          letter-spacing: -0.02em;
        }

        .shell-header__back {
          padding: 0.5rem 1rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .shell-header__back:hover {
          background: #dbeafe;
          border-color: #93c5fd;
        }

        .shell-header__back:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .screen-body {
          flex: 1;
          width: 100%;
          max-width: 42rem;
          margin: 0 auto;
          padding: 1.25rem 1.25rem 2rem;
          box-sizing: border-box;
        }

        .topic {
          margin: 0 0 1.5rem;
          padding: 1rem 1.125rem;
          font-size: 1rem;
          line-height: 1.5;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #2563eb;
          border-radius: 0.5rem;
        }

        .topic__label {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748b;
        }

        .landing {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.25rem 3rem;
          box-sizing: border-box;
          text-align: center;
        }

        .landing__header {
          max-width: 36rem;
          margin-bottom: 2rem;
        }

        .landing__title {
          margin: 0 0 1rem;
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #0f172a;
        }

        .landing__subtitle {
          margin: 0;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.6;
          color: #64748b;
          font-weight: 400;
        }

        .landing__cta {
          margin: 0 0 2.5rem;
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: #2563eb;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
        }

        .landing__cta:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .landing__cta:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 3px;
        }

        .landing__cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          width: 100%;
          max-width: 32rem;
        }

        .landing__card {
          margin: 0;
          padding: 1.5rem 1.25rem;
          text-align: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .landing__card:hover {
          border-color: #93c5fd;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
        }

        .landing__card:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .landing__card-title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e40af;
          letter-spacing: -0.01em;
        }

        .message-list {
          list-style: none;
          margin: 0 0 1.5rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .message {
          padding: 0.875rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.625rem;
        }

        .message--you {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .message__author {
          margin: 0 0 0.35rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1e40af;
        }

        .message__text {
          margin: 0;
          font-size: 0.9375rem;
          line-height: 1.55;
          color: #334155;
        }

        .composer {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          align-items: stretch;
        }

        .composer__input {
          flex: 1 1 12rem;
          min-width: 0;
          padding: 0.75rem 0.875rem;
          font-size: 1rem;
          font-family: inherit;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          box-sizing: border-box;
        }

        .composer__input:focus {
          outline: 2px solid #2563eb;
          outline-offset: 0;
          border-color: #2563eb;
        }

        .composer__submit {
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          color: #ffffff;
          background: #2563eb;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .composer__submit:hover {
          background: #1d4ed8;
        }

        .composer__submit:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .tree-list {
          list-style: none;
          margin: 0 0 1.5rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tree-branch {
          margin: 0;
          padding: 1rem 1.125rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          border-left: 4px solid #2563eb;
          background: #ffffff;
        }

        .tree-branch__title {
          margin: 0 0 0.625rem;
          font-size: 1.0625rem;
          font-weight: 600;
          color: #1e40af;
        }

        .tree-branch__ideas {
          margin: 0;
          padding-left: 1.25rem;
          color: #475569;
          font-size: 0.9375rem;
          line-height: 1.55;
        }

        .tree-branch__ideas li {
          margin-bottom: 0.35rem;
        }

        @media (max-width: 480px) {
          .landing {
            padding: 2rem 1rem 2.5rem;
            justify-content: flex-start;
            padding-top: clamp(3rem, 15vh, 5rem);
          }

          .landing__cards {
            grid-template-columns: 1fr;
            max-width: 20rem;
          }

          .landing__cta {
            width: 100%;
            max-width: 20rem;
          }

          .composer__submit {
            width: 100%;
          }

          .shell-header {
            padding: 0.875rem 1rem;
          }
        }
      `}</style>

      {screen === 'landing' && (
        <main className="landing">
          <header className="landing__header">
            <h1 className="landing__title">CogniWeave</h1>
            <p className="landing__subtitle">
              Not everyone thinks through conversation the same way.
            </p>
          </header>

          <button type="button" className="landing__cta" onClick={goChat}>
            Start Discussion
          </button>

          <div className="landing__cards">
            <button
              type="button"
              className="landing__card"
              onClick={goChat}
            >
              <h2 className="landing__card-title">Chat View</h2>
            </button>
            <button
              type="button"
              className="landing__card"
              onClick={goTree}
            >
              <h2 className="landing__card-title">Tree View</h2>
            </button>
          </div>
        </main>
      )}

      {screen === 'chat' && (
        <div className="app">
          <header className="shell-header">
            <h1 className="shell-header__brand">CogniWeave</h1>
            <button
              type="button"
              className="shell-header__back"
              onClick={goLanding}
            >
              Back
            </button>
          </header>

          <div className="screen-body">
            <p className="topic">
              <span className="topic__label">Discussion topic</span>
              {DISCUSSION_TOPIC}
            </p>

            <ul className="message-list">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={
                    message.author === 'You'
                      ? 'message message--you'
                      : 'message'
                  }
                >
                  <p className="message__author">{message.author}</p>
                  <p className="message__text">{message.text}</p>
                </li>
              ))}
            </ul>

            <form className="composer" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="composer__input"
                placeholder="Add your message…"
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                aria-label="Message"
              />
              <button type="submit" className="composer__submit">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {screen === 'tree' && (
        <div className="app">
          <header className="shell-header">
            <h1 className="shell-header__brand">CogniWeave</h1>
            <button
              type="button"
              className="shell-header__back"
              onClick={goLanding}
            >
              Back
            </button>
          </header>

          <div className="screen-body">
            <p className="topic">
              <span className="topic__label">Discussion topic</span>
              {DISCUSSION_TOPIC}
            </p>

            <ul className="tree-list">
              {branches.map((branch) => (
                <li key={branch.id} className="tree-branch">
                  <h2 className="tree-branch__title">{branch.title}</h2>
                  <ul className="tree-branch__ideas">
                    {branch.ideas.map((idea, index) => (
                      <li key={`${branch.id}-idea-${index}`}>{idea}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <form className="composer" onSubmit={handleAddBranch}>
              <input
                type="text"
                className="composer__input"
                placeholder="New branch name…"
                value={branchDraft}
                onChange={(event) => setBranchDraft(event.target.value)}
                aria-label="Branch name"
              />
              <button type="submit" className="composer__submit">
                Add Branch
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
