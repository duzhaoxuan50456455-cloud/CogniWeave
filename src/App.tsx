function App() {
  return (
    <>
      <style>{`
        #root {
          width: 100%;
          max-width: none;
          margin: 0;
          border: none;
          text-align: center;
        }

        .landing {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.25rem 3rem;
          box-sizing: border-box;
          background: #ffffff;
          color: #0f172a;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
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

        .landing__cta:active {
          transform: translateY(1px);
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
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .landing__card:hover {
          border-color: #93c5fd;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
        }

        .landing__card-title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e40af;
          letter-spacing: -0.01em;
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
        }
      `}</style>

      <main className="landing">
        <header className="landing__header">
          <h1 className="landing__title">CogniWeave</h1>
          <p className="landing__subtitle">
            Not everyone thinks through conversation the same way.
          </p>
        </header>

        <button type="button" className="landing__cta">
          Start Discussion
        </button>

        <div className="landing__cards">
          <article className="landing__card">
            <h2 className="landing__card-title">Chat View</h2>
          </article>
          <article className="landing__card">
            <h2 className="landing__card-title">Tree View</h2>
          </article>
        </div>
      </main>
    </>
  )
}

export default App
