import { useEffect, useMemo, useRef } from 'react'
import type { Contribution, ReplyRelation } from '../types/discussion'

type Point = { x: number; y: number }

type ConversationMapProps = {
  messages: Contribution[]
  selectedMessageId: string | null
  focusSelectedMessage: boolean
  onSelectMessage: (messageId: string) => void
}

const NODE_WIDTH = 176
const NODE_HEIGHT = 68
const NODE_X_GAP = 42
const NODE_Y_GAP = 54

const RELATION_LABELS: Record<ReplyRelation, string> = {
  reply: 'Reply',
  support: 'Support',
  challenge: 'Challenge',
  question: 'Question',
}

function getMessageParentId(message: Contribution, messagesById: Map<string, Contribution>): string | null {
  if (message.replyToId && messagesById.has(message.replyToId)) return message.replyToId
  if (message.parentId && messagesById.has(message.parentId)) return message.parentId
  return null
}

function excerpt(body: string): string {
  return body.length > 62 ? `${body.slice(0, 59)}…` : body
}

function getReplyRelation(message: Contribution): ReplyRelation {
  return message.replyRelation ?? 'reply'
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
      const candidateParentId = getMessageParentId(message, messagesById)
      const parentId = candidateParentId === message.id ? null : candidateParentId
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
    const clusterWidth = new Map<string, number>()
    const getClusterWidth = (message: Contribution): number => {
      const descendants = children.get(message.id) ?? []
      const width = descendants.length === 0
        ? NODE_WIDTH
        : Math.max(
            NODE_WIDTH,
            descendants.reduce((total, child) => total + getClusterWidth(child), 0) + NODE_X_GAP * (descendants.length - 1),
          )
      clusterWidth.set(message.id, width)
      return width
    }
    const visit = (message: Contribution, depth: number, left: number) => {
      const width = clusterWidth.get(message.id) ?? NODE_WIDTH
      positions[message.id] = {
        x: left + (width - NODE_WIDTH) / 2,
        y: 28 + depth * (NODE_HEIGHT + NODE_Y_GAP),
      }
      let childLeft = left
      ;(children.get(message.id) ?? []).forEach((child) => {
        const childWidth = clusterWidth.get(child.id) ?? NODE_WIDTH
        visit(child, depth + 1, childLeft)
        childLeft += childWidth + NODE_X_GAP
      })
    }

    let rootLeft = 28
    roots.forEach((root) => {
      const rootWidth = getClusterWidth(root)
      visit(root, 0, rootLeft)
      rootLeft += rootWidth + NODE_X_GAP * 2
    })

    // A malformed imported discussion must not blank the Map. Keep any node that
    // could not be reached from a root independent rather than dereferencing an
    // absent layout position during rendering.
    messages.forEach((message) => {
      if (positions[message.id]) return
      parentIds.set(message.id, null)
      positions[message.id] = { x: rootLeft, y: 28 }
      rootLeft += NODE_WIDTH + NODE_X_GAP * 2
    })
    const maxDepth = Object.values(positions).reduce(
      (deepest, point) => Math.max(deepest, point.y),
      0,
    )

    return {
      positions,
      parentIds,
      contentHeight: Math.max(280, maxDepth + NODE_HEIGHT + 32),
      contentWidth: Math.max(420, rootLeft - NODE_X_GAP),
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
              const startX = parentPosition.x + NODE_WIDTH / 2
              const startY = parentPosition.y + NODE_HEIGHT
              const endX = childPosition.x + NODE_WIDTH / 2
              const endY = childPosition.y
              const controlY = startY + (endY - startY) / 2
              const relation = getReplyRelation(message)
              return (
                <g key={`${parentId}-${message.id}`} className={`conversation-map__edge conversation-map__edge--${relation}`}>
                  <path d={`M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`} />
                  <text x={(startX + endX) / 2} y={controlY - 5}>{RELATION_LABELS[relation]}</text>
                </g>
              )
            })}
          </svg>
          {messages.map((message) => {
            const point = positions[message.id] ?? { x: 28, y: 28 }
            return (
              <button
                type="button"
                key={message.id}
                ref={(node) => { nodeRefs.current[message.id] = node }}
                className={`conversation-map__node${parentIds.get(message.id) ? ` conversation-map__node--reply conversation-map__node--${getReplyRelation(message)}` : ' conversation-map__node--root'}${selectedMessageId === message.id ? ' conversation-map__node--selected' : ''}`}
                style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
                onClick={() => onSelectMessage(message.id)}
                aria-label={`Open ${message.author}'s message in the conversation`}
                aria-current={selectedMessageId === message.id ? 'true' : undefined}
              >
                <span>{parentIds.get(message.id) ? `${RELATION_LABELS[getReplyRelation(message)]} · ${message.author}` : `Message · ${message.author}`}</span>
                <strong>{excerpt(message.body)}</strong>
                {parentIds.get(message.id) && <small>Explicit {RELATION_LABELS[getReplyRelation(message)].toLowerCase()} link</small>}
              </button>
            )
          })}
        </div>
      </div>
      <p className="conversation-map__hint">Only explicit reply links are shown. Select a node to locate its original message.</p>
    </aside>
  )
}
