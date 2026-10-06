import { useEffect, useMemo, useRef } from 'react'
import type { Contribution } from '../types/discussion'

type Point = { x: number; y: number }

type ConversationMapProps = {
  messages: Contribution[]
  selectedMessageId: string | null
  focusSelectedMessage: boolean
  onSelectMessage: (messageId: string) => void
}

const NODE_WIDTH = 218
const NODE_HEIGHT = 76
const NODE_GAP = 28

function getMessageParentId(message: Contribution, messagesById: Map<string, Contribution>): string | null {
  if (message.replyToId && messagesById.has(message.replyToId)) return message.replyToId
  if (message.parentId && messagesById.has(message.parentId)) return message.parentId
  return null
}

function excerpt(body: string): string {
  return body.length > 84 ? `${body.slice(0, 81)}…` : body
}

export function ConversationMap({
  messages,
  selectedMessageId,
  focusSelectedMessage,
  onSelectMessage,
}: ConversationMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const { positions, parentIds, contentHeight, contentWidth } = useMemo(() => {
    const messagesById = new Map(messages.map((message) => [message.id, message]))
    const parentIds = new Map<string, string | null>()
    const children = new Map<string, Contribution[]>()
    const roots: Contribution[] = []

    messages.forEach((message) => {
      const parentId = getMessageParentId(message, messagesById)
      parentIds.set(message.id, parentId)
      if (!parentId) {
        roots.push(message)
        return
      }
      const siblings = children.get(parentId) ?? []
      siblings.push(message)
      children.set(parentId, siblings)
    })

    const positions: Record<string, Point> = {}
    let row = 0
    let maxDepth = 0
    const visit = (message: Contribution, depth: number) => {
      positions[message.id] = { x: 24 + depth * 150, y: 24 + row * (NODE_HEIGHT + NODE_GAP) }
      row += 1
      maxDepth = Math.max(maxDepth, depth)
      ;(children.get(message.id) ?? []).forEach((child) => visit(child, depth + 1))
    }
    roots.forEach((root) => visit(root, 0))

    return {
      positions,
      parentIds,
      contentHeight: Math.max(280, row * (NODE_HEIGHT + NODE_GAP) + 24),
      contentWidth: Math.max(420, 48 + maxDepth * 150 + NODE_WIDTH),
    }
  }, [messages])

  useEffect(() => {
    if (!focusSelectedMessage || !selectedMessageId) return
    const viewport = viewportRef.current
    const node = nodeRefs.current[selectedMessageId]
    if (!viewport || !node) return

    const viewportRect = viewport.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()
    const nodeIsVisible =
      nodeRect.top >= viewportRect.top &&
      nodeRect.bottom <= viewportRect.bottom &&
      nodeRect.left >= viewportRect.left &&
      nodeRect.right <= viewportRect.right

    if (!nodeIsVisible) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [focusSelectedMessage, selectedMessageId])

  return (
    <aside className="conversation-map" aria-label="Conversation map">
      <div className="conversation-map__header">
        <div>
          <span>Discussion map</span>
          <strong>{messages.length} messages</strong>
        </div>
        <p>Reply lines reflect explicit message links.</p>
      </div>
      <div className="conversation-map__viewport" ref={viewportRef}>
        <div
          className="conversation-map__world"
          style={{ width: contentWidth, minHeight: contentHeight }}
        >
          <svg className="conversation-map__edges" width={contentWidth} height={contentHeight} aria-hidden="true">
            {messages.map((message) => {
              const parentId = parentIds.get(message.id)
              const childPosition = positions[message.id]
              const parentPosition = parentId ? positions[parentId] : undefined
              if (!parentPosition || !childPosition) return null
              const startX = parentPosition.x + NODE_WIDTH
              const startY = parentPosition.y + NODE_HEIGHT / 2
              const endX = childPosition.x
              const endY = childPosition.y + NODE_HEIGHT / 2
              const controlX = startX + (endX - startX) / 2
              return (
                <path
                  key={`${parentId}-${message.id}`}
                  d={`M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`}
                />
              )
            })}
          </svg>
          {messages.map((message) => {
            const point = positions[message.id]
            return (
              <button
                type="button"
                key={message.id}
                ref={(node) => { nodeRefs.current[message.id] = node }}
                className={`conversation-map__node${selectedMessageId === message.id ? ' conversation-map__node--selected' : ''}`}
                style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
                onClick={() => onSelectMessage(message.id)}
                aria-label={`Open ${message.author}'s message in the conversation`}
                aria-current={selectedMessageId === message.id ? 'true' : undefined}
              >
                <span>{message.author}</span>
                <strong>{excerpt(message.body)}</strong>
                {parentIds.get(message.id) && <small>↳ Reply</small>}
              </button>
            )
          })}
        </div>
      </div>
      <p className="conversation-map__hint">Select a node to locate its original message.</p>
    </aside>
  )
}
