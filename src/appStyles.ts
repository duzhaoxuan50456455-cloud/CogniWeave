export const appStyles = `
  :root { --blue: #2563eb; --blue-dark: #1d4ed8; --navy: #0f172a; --muted: #64748b; --line: #e2e8f0; --soft: #f8fafc; }
  #root { width: 100%; min-height: 100svh; }
  button { cursor: pointer; }
  button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid rgba(37,99,235,.22); outline-offset: 2px; }

  .landing, .mode-selection, .preference-quiz { min-height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1.25rem; text-align: center; background: radial-gradient(circle at 50% 0%, #eff6ff 0, #fff 34rem); }
  .landing__header, .mode-selection__header, .preference-quiz__header { max-width: 38rem; margin-bottom: 2rem; }
  .landing__title, .mode-selection__title, .preference-quiz__title { margin: 0 0 .8rem; color: var(--navy); font-size: clamp(2.2rem,6vw,3.25rem); letter-spacing: -.045em; line-height: 1.05; }
  .landing__subtitle, .mode-selection__subtitle, .preference-quiz__subtitle { margin: 0; color: var(--muted); font-size: 1.06rem; line-height: 1.6; }
  .landing__cta { border: 0; border-radius: .75rem; padding: .9rem 1.6rem; margin-bottom: 2.25rem; color: #fff; background: var(--blue); font-weight: 700; box-shadow: 0 10px 24px rgba(37,99,235,.22); }
  .landing__cta:hover { background: var(--blue-dark); }
  .landing__cards { width: min(100%,32rem); display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .landing__card, .mode-option { width: 100%; border: 1px solid var(--line); border-radius: 1rem; padding: 1.35rem; background: rgba(255,255,255,.9); text-align: left; transition: .2s ease; }
  .landing__card { text-align: center; }
  .landing__card:hover, .mode-option:hover { border-color: #93c5fd; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,.09); }
  .landing__card-title, .mode-option__title { margin: 0 0 .3rem; color: #1e40af; font-size: 1.05rem; }
  .mode-option__description { margin: 0; color: var(--muted); line-height: 1.5; }
  .mode-selection__toolbar { width: min(100%,32rem); margin-bottom: 1.25rem; text-align: left; }
  .mode-selection__list { width: min(100%,32rem); display: grid; gap: .85rem; margin: 0; padding: 0; list-style: none; }
  .shell-header__back { border: 1px solid #bfdbfe; border-radius: .65rem; padding: .6rem .9rem; background: #eff6ff; color: var(--blue); font-weight: 650; }

  /* Preference quiz */
  .preference-quiz { justify-content: flex-start; padding-top: 0; background: linear-gradient(145deg,#f8fbff,#fff 45%,#eff6ff); }
  .quiz-topbar { width: min(100%,70rem); height: 5rem; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
  .quiz-back, .quiz-alternative { justify-self: start; border: 0; background: transparent; color: var(--muted); font-weight: 650; }
  .quiz-brand { display: flex; align-items: center; gap: .55rem; color: #1e3a8a; font-weight: 800; letter-spacing: -.02em; }
  .quiz-brand span, .discussion-header__mark { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: .6rem; color: white; background: linear-gradient(145deg,#3b82f6,#1d4ed8); }
  .quiz-card { width: min(100%,42rem); margin: clamp(1rem,7vh,5rem) auto 3rem; padding: clamp(1.5rem,5vw,3rem); border: 1px solid #dbeafe; border-radius: 1.5rem; background: rgba(255,255,255,.94); box-shadow: 0 24px 70px rgba(30,64,175,.12); text-align: left; }
  .quiz-progress-row { display: flex; justify-content: space-between; color: var(--muted); font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  .quiz-progress-track { height: 5px; margin: .7rem 0 2.3rem; overflow: hidden; border-radius: 10px; background: #e2e8f0; }
  .quiz-progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--blue); transition: width .25s ease; }
  .quiz-kicker { color: var(--blue); font-size: .76rem; font-weight: 800; text-transform: uppercase; letter-spacing: .11em; }
  .quiz-copy h1, .quiz-result h1 { margin: .55rem 0 .7rem; color: var(--navy); font-size: clamp(1.7rem,4vw,2.35rem); line-height: 1.16; letter-spacing: -.035em; }
  .quiz-copy p, .quiz-result > p { margin: 0; color: var(--muted); line-height: 1.6; }
  .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; }
  .quiz-option { position: relative; display: flex; flex-direction: column; min-height: 12rem; padding: 1.25rem; border: 2px solid var(--line); border-radius: 1rem; background: #fff; text-align: left; transition: .18s ease; }
  .quiz-option:hover { border-color: #93c5fd; transform: translateY(-2px); }
  .quiz-option--selected { border-color: var(--blue); background: #eff6ff; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
  .quiz-option__icon { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; margin-bottom: 1rem; border-radius: .75rem; color: #1d4ed8; background: #dbeafe; font-size: 1.15rem; }
  .quiz-option__copy { display: grid; gap: .4rem; }
  .quiz-option__copy strong { color: var(--navy); font-size: 1rem; }
  .quiz-option__copy small { color: var(--muted); line-height: 1.5; }
  .quiz-option__radio { position: absolute; right: 1rem; top: 1rem; width: 1.05rem; height: 1.05rem; border: 2px solid #cbd5e1; border-radius: 50%; }
  .quiz-option--selected .quiz-option__radio { border: 4px solid var(--blue); background: #fff; }
  .quiz-next, .tree-add-button { width: 100%; display: flex; justify-content: center; gap: .65rem; border: 0; border-radius: .75rem; padding: .9rem 1.25rem; background: var(--blue); color: white; font-weight: 750; }
  .quiz-next:hover, .tree-add-button:hover { background: var(--blue-dark); }
  .quiz-next:disabled, .tree-add-button:disabled { opacity: .4; cursor: not-allowed; }
  .quiz-result { text-align: center; }
  .quiz-result__icon { display: grid; place-items: center; width: 4rem; height: 4rem; margin: 0 auto 1.4rem; border-radius: 1.2rem; color: #fff; background: linear-gradient(145deg,#60a5fa,#1d4ed8); font-size: 1.7rem; box-shadow: 0 12px 30px rgba(37,99,235,.25); }
  .quiz-result__traits { display: flex; flex-wrap: wrap; justify-content: center; gap: .55rem; margin: 1.6rem 0; }
  .quiz-result__traits span { padding: .45rem .7rem; border-radius: 2rem; background: #eff6ff; color: #1d4ed8; font-size: .78rem; font-weight: 700; }
  .quiz-result .quiz-alternative { display: block; margin: 1.1rem auto; color: var(--blue); }
  .quiz-disclaimer { display: block; color: #94a3b8; }

  /* Messaging */
  .chat-shell { height: 100svh; display: flex; flex-direction: column; overflow: hidden; background: #f7f9fc; color: var(--navy); }
  .discussion-header { flex: 0 0 auto; min-height: 4.75rem; display: grid; grid-template-columns: 3rem 1fr 3rem; align-items: center; padding: .7rem clamp(1rem,4vw,2rem); border-bottom: 1px solid var(--line); background: rgba(255,255,255,.96); z-index: 2; }
  .discussion-header__identity { display: flex; align-items: center; justify-content: center; gap: .7rem; }
  .discussion-header__title { margin: 0; color: var(--navy); font-size: 1rem; letter-spacing: -.02em; }
  .discussion-header__status { margin: .15rem 0 0; color: var(--muted); font-size: .72rem; }
  .status-dot { display: inline-block; width: .46rem; height: .46rem; margin-right: .25rem; border-radius: 50%; background: #22c55e; }
  .icon-button { width: 2.5rem; height: 2.5rem; display: grid; place-items: center; border: 1px solid var(--line); border-radius: .75rem; background: #fff; color: #334155; font-size: 1.05rem; font-weight: 700; }
  .icon-button:hover { background: #eff6ff; border-color: #bfdbfe; }
  .chat-main { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; width: min(100%,52rem); margin: 0 auto; }
  .chat-topic { flex: 0 0 auto; margin: 1.25rem 1.25rem .25rem; padding: 1rem 1.25rem; border: 1px solid #dbeafe; border-radius: 1rem; background: linear-gradient(125deg,#eff6ff,#fff); }
  .chat-topic__eyebrow { color: var(--blue); font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
  .chat-topic h2 { margin: .3rem 0; color: var(--navy); font-size: 1.05rem; }
  .chat-topic p { margin: 0; color: var(--muted); font-size: .8rem; }
  .chat-thread { flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 1rem 1.25rem 1.5rem; scrollbar-width: thin; }
  .date-divider { display: flex; align-items: center; gap: .7rem; margin: .5rem 0 1.5rem; color: #94a3b8; font-size: .7rem; font-weight: 700; }
  .date-divider::before, .date-divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
  .chat-message { display: flex; align-items: flex-end; gap: .65rem; margin-bottom: 1.2rem; }
  .chat-message--you { justify-content: flex-end; }
  .avatar { flex: 0 0 auto; width: 2.25rem; height: 2.25rem; display: grid; place-items: center; border: 3px solid #fff; border-radius: 50%; color: #fff; font-size: .68rem; font-weight: 800; box-shadow: 0 2px 8px rgba(15,23,42,.12); }
  .avatar--you { background: linear-gradient(145deg,#60a5fa,#1d4ed8); }
  .chat-message__content { max-width: min(76%,34rem); }
  .chat-message__meta { display: flex; align-items: center; gap: .55rem; margin: 0 0 .35rem .2rem; }
  .chat-message--you .chat-message__meta { justify-content: flex-end; margin-right: .2rem; }
  .chat-message__author { color: #334155; font-size: .73rem; font-weight: 750; }
  .chat-message__meta time { color: #94a3b8; font-size: .67rem; }
  .chat-message__bubble { padding: .75rem 1rem; border: 1px solid var(--line); border-radius: .35rem 1.1rem 1.1rem 1.1rem; background: #fff; box-shadow: 0 3px 12px rgba(15,23,42,.05); }
  .chat-message--you .chat-message__bubble { border-color: var(--blue); border-radius: 1.1rem .35rem 1.1rem 1.1rem; background: var(--blue); color: #fff; box-shadow: 0 5px 16px rgba(37,99,235,.2); }
  .chat-message__bubble p { margin: 0; font-size: .9rem; line-height: 1.55; }
  .typing-row { display: flex; align-items: center; gap: .55rem; color: #94a3b8; font-size: .72rem; }
  .avatar--small { width: 1.8rem; height: 1.8rem; }
  .typing-bubble { display: flex; gap: 3px; padding: .6rem .75rem; border: 1px solid var(--line); border-radius: 1rem; background: #fff; }
  .typing-bubble i { width: 5px; height: 5px; border-radius: 50%; background: #94a3b8; animation: typing 1.2s infinite; }
  .typing-bubble i:nth-child(2) { animation-delay: .15s; } .typing-bubble i:nth-child(3) { animation-delay: .3s; }
  @keyframes typing { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
  .chat-composer { flex: 0 0 auto; border-top: 1px solid var(--line); background: #fff; padding: .85rem 1.25rem max(.85rem,env(safe-area-inset-bottom)); }
  .chat-composer__inner { width: min(100%,49.5rem); margin: 0 auto; display: flex; align-items: center; gap: .65rem; padding: .5rem; border: 1px solid #cbd5e1; border-radius: 1rem; background: #f8fafc; }
  .chat-composer__inner:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
  .chat-composer input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--navy); }
  .composer-action, .send-button { flex: 0 0 auto; width: 2.15rem; height: 2.15rem; display: grid; place-items: center; border: 0; border-radius: .65rem; }
  .composer-action { background: #e2e8f0; color: #475569; font-size: 1.25rem; }
  .send-button { background: var(--blue); color: #fff; font-size: 1.1rem; font-weight: 800; }
  .send-button:disabled { background: #cbd5e1; cursor: default; }

  /* Visual tree canvas */
  .tree-shell { height: 100svh; display: flex; flex-direction: column; overflow: hidden; background: #f8fafc; color: var(--navy); }
  .tree-header { flex: 0 0 auto; min-height: 5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem 1.25rem; border-bottom: 1px solid var(--line); background: #fff; z-index: 4; }
  .tree-header__left, .tree-header__actions { display: flex; align-items: center; gap: 1rem; }
  .tree-header__brand { color: var(--blue); font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
  .tree-header h1 { margin: .15rem 0 0; max-width: 38rem; overflow: hidden; color: var(--navy); font-size: 1rem; text-overflow: ellipsis; white-space: nowrap; }
  .tree-save-state { color: var(--muted); font-size: .75rem; }
  .tree-add-button { width: auto; }
  .tree-workspace { flex: 1; min-height: 0; display: flex; }
  .tree-sidebar { flex: 0 0 13.5rem; padding: 1.5rem 1.25rem; border-right: 1px solid var(--line); background: #fff; z-index: 3; }
  .tree-sidebar__label { display: block; margin-bottom: 1.5rem; color: #94a3b8; font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; }
  .tree-sidebar strong { color: #334155; font-size: .9rem; }
  .tree-sidebar > p { margin: .35rem 0; color: var(--muted); font-size: .78rem; }
  .tree-sidebar__hint { display: flex; gap: .65rem; margin-top: 2rem; padding: .9rem; border-radius: .8rem; background: #eff6ff; color: var(--blue); }
  .tree-sidebar__hint p { margin: 0; color: var(--muted); font-size: .7rem; line-height: 1.5; }
  .tree-sidebar__hint strong { display: block; color: #1e40af; font-size: .74rem; }
  .node-canvas { position: relative; flex: 1; min-width: 0; overflow: hidden; touch-action: none; cursor: grab; background-color: #f8fafc; background-image: radial-gradient(#cbd5e1 1px,transparent 1px); background-size: 22px 22px; }
  .node-canvas:active { cursor: grabbing; }
  .canvas-world { position: absolute; inset: 0; width: 1800px; height: 1200px; transform-origin: 0 0; will-change: transform; }
  .node-edges { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
  .node-edges path { fill: none; stroke: #93c5fd; stroke-width: 2.5; }
  .canvas-instructions { position: absolute; top: 1rem; left: 1rem; z-index: 2; padding: .45rem .7rem; border: 1px solid var(--line); border-radius: 2rem; background: rgba(255,255,255,.9); color: var(--muted); font-size: .68rem; box-shadow: 0 3px 12px rgba(15,23,42,.06); }
  .canvas-controls { position: absolute; right: 1rem; bottom: 1rem; z-index: 3; display: flex; align-items: center; overflow: hidden; border: 1px solid var(--line); border-radius: .75rem; background: #fff; box-shadow: 0 8px 25px rgba(15,23,42,.12); }
  .canvas-controls button, .canvas-controls span { min-width: 2.4rem; height: 2.35rem; display: grid; place-items: center; border: 0; border-right: 1px solid var(--line); background: #fff; color: #475569; font-weight: 700; }
  .canvas-controls span { min-width: 3.4rem; font-size: .67rem; }
  .discussion-node { position: absolute; display: flex; flex-direction: column; padding: .85rem; border: 1px solid #cbd5e1; border-top: 4px solid #60a5fa; border-radius: .8rem; background: #fff; box-shadow: 0 8px 25px rgba(15,23,42,.1); cursor: grab; user-select: none; }
  .discussion-node--root { border-top-color: var(--blue); box-shadow: 0 10px 28px rgba(37,99,235,.14); }
  .discussion-node__topline { display: flex; align-items: center; justify-content: space-between; margin-bottom: .45rem; }
  .relation-pill { padding: .2rem .45rem; border-radius: 1rem; background: #eff6ff; color: var(--blue); font-size: .58rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .relation-pill--challenge { background: #fff1f2; color: #e11d48; } .relation-pill--question { background: #fefce8; color: #a16207; } .relation-pill--support { background: #ecfdf5; color: #047857; }
  .discussion-node__drag { color: #94a3b8; }
  .discussion-node__title, .discussion-node__body { width: 100%; border: 1px solid transparent; border-radius: .35rem; background: transparent; color: var(--navy); user-select: text; }
  .discussion-node__title { padding: .25rem; font-size: .93rem; font-weight: 800; letter-spacing: -.015em; }
  .discussion-node__body { flex: 1; min-height: 3.6rem; margin-top: .2rem; padding: .3rem; resize: none; color: #475569; font-size: .73rem; line-height: 1.45; }
  .discussion-node__title:hover, .discussion-node__body:hover { border-color: var(--line); }
  .discussion-node__footer { display: flex; align-items: center; justify-content: space-between; margin-top: .45rem; padding-top: .55rem; border-top: 1px solid #f1f5f9; }
  .node-author { display: flex; align-items: center; gap: .35rem; color: var(--muted); font-size: .62rem; font-weight: 700; }
  .node-author span { width: 1.2rem; height: 1.2rem; display: grid; place-items: center; border-radius: 50%; background: #dbeafe; color: var(--blue); }
  .node-action { width: 1.55rem; height: 1.55rem; margin-left: .25rem; border: 1px solid var(--line); border-radius: .4rem; background: #f8fafc; color: var(--muted); font-size: .7rem; font-weight: 800; }
  .node-action--add { background: #eff6ff; border-color: #bfdbfe; color: var(--blue); }
  .node-dialog-backdrop { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 1rem; background: rgba(15,23,42,.38); backdrop-filter: blur(3px); }
  .node-dialog { width: min(100%,30rem); padding: 1.7rem; border-radius: 1rem; background: #fff; box-shadow: 0 25px 70px rgba(15,23,42,.25); }
  .node-dialog h2 { margin: .4rem 0 1.4rem; color: var(--navy); }
  .node-dialog label { display: grid; gap: .4rem; margin-bottom: 1rem; color: #334155; font-size: .75rem; font-weight: 750; }
  .node-dialog input, .node-dialog textarea { width: 100%; padding: .75rem; border: 1px solid #cbd5e1; border-radius: .6rem; color: var(--navy); }
  .node-dialog textarea { min-height: 7rem; resize: vertical; }
  .node-dialog__actions { display: flex; align-items: center; justify-content: flex-end; gap: .6rem; }
  .node-dialog__actions .quiz-alternative { padding: .7rem 1rem; }

  @media (max-width: 720px) {
    .landing__cards, .quiz-options { grid-template-columns: 1fr; }
    .quiz-option { min-height: auto; }
    .quiz-card { margin-top: 1rem; }
    .tree-sidebar { display: none; }
    .tree-save-state { display: none; }
    .tree-header h1 { max-width: 42vw; }
    .chat-message__content { max-width: 82%; }
  }
  @media (max-width: 480px) {
    .landing, .mode-selection { justify-content: flex-start; padding-top: 4rem; }
    .quiz-topbar { height: 4rem; }
    .quiz-card { padding: 1.25rem; }
    .tree-header { padding: .6rem .75rem; }
    .tree-header__brand { display: none; }
    .tree-header__actions .tree-add-button { padding: .7rem; font-size: .75rem; }
    .chat-topic { margin: .8rem .8rem .2rem; }
    .chat-thread { padding-inline: .8rem; }
    .chat-composer { padding-inline: .8rem; }
  }
`
