export const appStyles = `
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

  .landing,
  .mode-selection,
  .preference-quiz {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1.25rem 3rem;
    box-sizing: border-box;
    text-align: center;
    background: #ffffff;
  }

  .landing__header,
  .mode-selection__header,
  .preference-quiz__header {
    max-width: 36rem;
    margin-bottom: 2rem;
  }

  .landing__title,
  .mode-selection__title,
  .preference-quiz__title {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 6vw, 2.75rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: #0f172a;
  }

  .landing__subtitle,
  .mode-selection__subtitle,
  .preference-quiz__subtitle {
    margin: 0;
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    line-height: 1.6;
    color: #64748b;
    font-weight: 400;
  }

  .landing__cta,
  .preference-quiz__primary {
    margin: 0 0 1rem;
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background: #2563eb;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
    transition: background 0.2s ease, box-shadow 0.2s ease;
    font-family: inherit;
  }

  .landing__cta {
    margin-bottom: 2.5rem;
  }

  .landing__cta:hover,
  .preference-quiz__primary:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  }

  .landing__cta:focus-visible,
  .mode-option:focus-visible,
  .preference-quiz__choice:focus-visible,
  .preference-quiz__primary:focus-visible,
  .preference-quiz__secondary:focus-visible {
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

  .landing__card,
  .mode-option,
  .preference-quiz__choice {
    margin: 0;
    padding: 1.25rem 1.125rem;
    text-align: left;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
  }

  .landing__card {
    text-align: center;
  }

  .landing__card:hover,
  .mode-option:hover,
  .preference-quiz__choice:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  }

  .landing__card-title,
  .mode-option__title {
    margin: 0 0 0.35rem;
    font-size: 1.0625rem;
    font-weight: 600;
    color: #1e40af;
    letter-spacing: -0.01em;
  }

  .mode-option__description {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #64748b;
  }

  .mode-selection__toolbar,
  .preference-quiz__toolbar {
    width: 100%;
    max-width: 32rem;
    margin-bottom: 1.25rem;
    display: flex;
    justify-content: flex-start;
  }

  .mode-selection__list,
  .preference-quiz__choices {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    width: 100%;
    max-width: 32rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .preference-quiz__panel {
    width: 100%;
    max-width: 32rem;
  }

  .preference-quiz__progress {
    margin: 0 0 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #64748b;
  }

  .preference-quiz__question {
    margin: 0 0 1.25rem;
    font-size: 1.125rem;
    line-height: 1.5;
    font-weight: 600;
    color: #0f172a;
    text-align: left;
  }

  .preference-quiz__choice-label {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #334155;
  }

  .preference-quiz__result {
    margin: 0 0 1rem;
    font-size: 1.125rem;
    line-height: 1.55;
    font-weight: 600;
    color: #1e40af;
    text-align: left;
  }

  .preference-quiz__disclaimer {
    margin: 0 0 1.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #64748b;
    text-align: left;
  }

  .preference-quiz__actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 32rem;
  }

  .preference-quiz__secondary {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: #2563eb;
    background: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 0.5rem;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .preference-quiz__secondary:hover {
    background: #eff6ff;
    border-color: #93c5fd;
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

  .message__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .message__author {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #1e40af;
  }

  .message__relation {
    margin: 0;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    background: #f1f5f9;
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
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

  .tree-branch__children {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tree-child {
    margin: 0;
    padding: 0.625rem 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #475569;
  }

  .tree-child__meta {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: 480px) {
    .landing,
    .mode-selection,
    .preference-quiz {
      padding: 2rem 1rem 2.5rem;
      justify-content: flex-start;
      padding-top: clamp(2rem, 12vh, 4rem);
    }

    .landing__cards {
      grid-template-columns: 1fr;
      max-width: 20rem;
    }

    .landing__cta {
      width: 100%;
      max-width: 20rem;
    }

    .composer__submit,
    .preference-quiz__primary,
    .preference-quiz__secondary {
      width: 100%;
    }

    .shell-header {
      padding: 0.875rem 1rem;
    }
  }
`
