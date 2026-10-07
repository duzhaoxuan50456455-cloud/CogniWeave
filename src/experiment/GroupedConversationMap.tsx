import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { ReplyRelation } from '../types/discussion'
import type { ExperimentContribution } from './discussions'

type GroupedConversationMapProps = {
  messages: ExperimentContribution[]
  selectedMessageId: string | null
  focusSelectedMessage: boolean
  onPreviewOpen: (messageId: string) => void
  onPreviewClose: (messageId: string) => void
  onViewInConversation: (messageId: string) => void
}

const RELATION_BADGES: Record<ReplyRelation, string> = {
  reply: 'Reply', support: 'Support', challenge: 'Challenge', question: 'Question',
}

function parentId(message: ExperimentContribution, messagesById: Map<string, ExperimentContribution>) {
  const candidate = message.replyToId ?? message.parentId
  return candidate && candidate !== message.id && messagesById.has(candidate) ? candidate : null
}

export function GroupedConversationMap({ messages, selectedMessageId, focusSelectedMessage, onPreviewOpen, onPreviewClose, onViewInConversation }: GroupedConversationMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [previewMessageId, setPreviewMessageId] = useState<string | null>(null)
  const { roots, children, parents } = useMemo(() => {
    const messagesById = new Map(messages.map((message) => [message.id, message]))
    const children = new Map<string, ExperimentContribution[]>()
    const parents = new Map<string, string | null>()
    const roots: ExperimentContribution[] = []
    messages.forEach((message) => {
      const parent = parentId(message, messagesById)
      parents.set(message.id, parent)
      if (!parent) roots.push(message)
      else children.set(parent, [...(children.get(parent) ?? []), message])
    })
    return { roots, children, parents }
  }, [messages])

  useEffect(() => {
    if (!focusSelectedMessage || !selectedMessageId) return
    const node = nodeRefs.current[selectedMessageId]
    const viewport = viewportRef.current
    if (!node || !viewport) return
    const nodeRect = node.getBoundingClientRect()
    const viewportRect = viewport.getBoundingClientRect()
    if (nodeRect.top < viewportRect.top || nodeRect.bottom > viewportRect.bottom || nodeRect.left < viewportRect.left || nodeRect.right > viewportRect.right) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }, [focusSelectedMessage, selectedMessageId])

  useEffect(() => {
    function closePreview(event: PointerEvent) {
      const target = event.target
      if (!previewMessageId || !(target instanceof Element) || target.closest('.grouped-map__preview, .grouped-map__node')) return
      setPreviewMessageId(null)
      onPreviewClose(previewMessageId)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !previewMessageId) return
      setPreviewMessageId(null)
      onPreviewClose(previewMessageId)
    }
    document.addEventListener('pointerdown', closePreview)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', closePreview)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onPreviewClose, previewMessageId])

  function openPreview(messageId: string) {
    if (previewMessageId && previewMessageId !== messageId) onPreviewClose(previewMessageId)
    setPreviewMessageId(messageId)
    onPreviewOpen(messageId)
  }

  function viewInConversation(messageId: string) {
    setPreviewMessageId(null)
    onViewInConversation(messageId)
  }

  function renderNode(message: ExperimentContribution, depth: number): ReactNode {
    const relation = message.replyRelation ?? 'reply'
    const hasParent = Boolean(parents.get(message.id))
    return <li key={message.id} className={`grouped-map__item${hasParent ? ' grouped-map__item--child' : ''}`} style={{ '--depth': depth } as CSSProperties}>
      <button
        type="button"
        ref={(node) => { nodeRefs.current[message.id] = node }}
        className={`grouped-map__node grouped-map__node--${hasParent ? relation : 'root'}${selectedMessageId === message.id ? ' grouped-map__node--selected' : ''}`}
        onClick={() => openPreview(message.id)}
        aria-label={`Preview ${message.author}'s message`}
        aria-current={selectedMessageId === message.id ? 'true' : undefined}
      >
        <span className="grouped-map__speaker">{message.author}</span>
        <strong>{message.mapLabel}</strong>
        {hasParent && <small>{RELATION_BADGES[relation]}</small>}
      </button>
      {previewMessageId === message.id && <div className="grouped-map__preview" role="dialog" aria-label={`${message.author}'s message preview`}>
        <div className="grouped-map__preview-heading"><strong>{message.author}</strong>{hasParent && <span>{RELATION_BADGES[relation]}</span>}</div>
        <p>{message.body}</p>
        <div className="grouped-map__preview-actions">
          <button type="button" onClick={() => viewInConversation(message.id)}>View in conversation</button>
          <button type="button" className="grouped-map__preview-close" onClick={() => { setPreviewMessageId(null); onPreviewClose(message.id) }} aria-label="Close message preview" title="Close preview">×</button>
        </div>
      </div>}
      {(children.get(message.id)?.length ?? 0) > 0 && <ul className="grouped-map__children">{children.get(message.id)?.map((child) => renderNode(child, depth + 1))}</ul>}
    </li>
  }

  return <aside className="grouped-map" aria-label="Discussion map">
    <div className="grouped-map__header"><span>Discussion map</span><strong>{roots.length} branches · {messages.length} messages</strong></div>
    <div className="grouped-map__viewport" ref={viewportRef}>
      <div className="grouped-map__sections">
        {roots.map((root) => <section key={root.id} className="grouped-map__section" aria-labelledby={`${root.id}-title`}>
          <h3 id={`${root.id}-title`}>{root.branchTitle ?? root.mapLabel}</h3>
          <ul className="grouped-map__tree">{renderNode(root, 0)}</ul>
        </section>)}
      </div>
    </div>
    <p className="grouped-map__hint">Select an idea for a brief preview, then view it in the conversation.</p>
  </aside>
}
