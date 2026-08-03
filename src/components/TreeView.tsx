import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent,
} from 'react'
import type { Contribution } from '../types/discussion'
import { getBranchLabel } from '../types/discussion'

type Point = { x: number; y: number }
type Viewport = Point & { scale: number }
type NodeEditDraft = { id: string; title: string; body: string }

type TreeViewProps = {
  topic: string
  contributions: Contribution[]
  onUpdateContribution: (id: string, changes: Pick<Contribution, 'title' | 'body'>) => void
  onAddNode: (parentId: string | null, title: string, body: string) => void
  onBack: () => void
}

const NODE_WIDTH = 260
const NODE_HEIGHT = 190
const ROOT_START_X = 100
const ROOT_Y = 100

function buildInitialPositions(contributions: Contribution[]): Record<string, Point> {
  const positions: Record<string, Point> = {}
  const roots = contributions.filter((item) => item.parentId === null)

  roots.forEach((root, rootIndex) => {
    positions[root.id] = { x: ROOT_START_X + rootIndex * 340, y: ROOT_Y }
    const placeChildren = (parentId: string, depth: number, parentX: number) => {
      const children = contributions.filter((item) => item.parentId === parentId)
      children.forEach((child, childIndex) => {
        const spread = (childIndex - (children.length - 1) / 2) * 285
        positions[child.id] = { x: parentX + spread, y: ROOT_Y + depth * 280 }
        placeChildren(child.id, depth + 1, positions[child.id].x)
      })
    }
    placeChildren(root.id, 1, positions[root.id].x)
  })

  return positions
}

function clampScale(scale: number): number {
  return Math.min(1.8, Math.max(0.35, scale))
}

export function TreeView({ topic, contributions, onUpdateContribution, onAddNode, onBack }: TreeViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; startPointer: Point; startNode: Point } | null>(null)
  const panRef = useRef<{ startPointer: Point; startViewport: Point } | null>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [positions, setPositions] = useState<Record<string, Point>>(() => buildInitialPositions(contributions))
  const [viewport, setViewport] = useState<Viewport>({ x: 20, y: 20, scale: 0.82 })
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set())
  const [newNodeParent, setNewNodeParent] = useState<string | null | undefined>(undefined)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [editDraft, setEditDraft] = useState<NodeEditDraft | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  const resolvedPositions = useMemo(
    () => ({ ...buildInitialPositions(contributions), ...positions }),
    [contributions, positions],
  )

  const childrenByParent = useMemo(() => {
    const map = new Map<string, Contribution[]>()
    contributions.forEach((item) => {
      if (!item.parentId) return
      const children = map.get(item.parentId) ?? []
      children.push(item)
      map.set(item.parentId, children)
    })
    return map
  }, [contributions])

  const hiddenIds = useMemo(() => {
    const hidden = new Set<string>()
    const hideDescendants = (id: string) => {
      ;(childrenByParent.get(id) ?? []).forEach((child) => {
        hidden.add(child.id)
        hideDescendants(child.id)
      })
    }
    collapsedIds.forEach(hideDescendants)
    return hidden
  }, [childrenByParent, collapsedIds])

  const visibleContributions = contributions.filter((item) => !hiddenIds.has(item.id))

  useEffect(() => {
    const textarea = editTextareaRef.current
    if (!textarea || !editDraft) return
    textarea.style.height = '0px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [editDraft])

  const stopInteraction = useCallback(() => {
    dragRef.current = null
    panRef.current = null
    setIsInteracting(false)
  }, [])

  useEffect(() => {
    window.addEventListener('pointerup', stopInteraction)
    return () => window.removeEventListener('pointerup', stopInteraction)
  }, [stopInteraction])

  function handleCanvasPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    if (
      event.button !== 0 ||
      target.closest('.discussion-node, .canvas-controls, .canvas-instructions')
    ) return
    panRef.current = {
      startPointer: { x: event.clientX, y: event.clientY },
      startViewport: { x: viewport.x, y: viewport.y },
    }
    setIsInteracting(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current) {
      const drag = dragRef.current
      setPositions((current) => ({
        ...current,
        [drag.id]: {
          x: drag.startNode.x + (event.clientX - drag.startPointer.x) / viewport.scale,
          y: drag.startNode.y + (event.clientY - drag.startPointer.y) / viewport.scale,
        },
      }))
      return
    }
    if (panRef.current) {
      const pan = panRef.current
      setViewport((current) => ({
        ...current,
        x: pan.startViewport.x + event.clientX - pan.startPointer.x,
        y: pan.startViewport.y + event.clientY - pan.startPointer.y,
      }))
    }
  }

  function handleNodePointerDown(event: ReactPointerEvent<HTMLElement>, id: string) {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button, input, textarea')) return
    event.stopPropagation()
    dragRef.current = {
      id,
      startPointer: { x: event.clientX, y: event.clientY },
      startNode: resolvedPositions[id] ?? { x: 0, y: 0 },
    }
    setIsInteracting(true)
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const nextScale = clampScale(viewport.scale * (event.deltaY > 0 ? 0.9 : 1.1))
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top
    const worldX = (pointerX - viewport.x) / viewport.scale
    const worldY = (pointerY - viewport.y) / viewport.scale
    setViewport({
      scale: nextScale,
      x: pointerX - worldX * nextScale,
      y: pointerY - worldY * nextScale,
    })
  }

  function zoomBy(amount: number) {
    setViewport((current) => ({ ...current, scale: clampScale(current.scale + amount) }))
  }

  function resetView() {
    setViewport({ x: 20, y: 20, scale: 0.82 })
    setPositions(buildInitialPositions(contributions))
  }

  function openCreateNode(parentId: string | null) {
    setNewNodeParent(parentId)
    setNewTitle('')
    setNewBody('')
  }

  function saveNewNode() {
    if (newNodeParent === undefined || (!newTitle.trim() && !newBody.trim())) return
    onAddNode(newNodeParent, newTitle || 'Untitled idea', newBody)
    if (newNodeParent) {
      setCollapsedIds((current) => {
        const next = new Set(current)
        next.delete(newNodeParent)
        return next
      })
    }
    setNewNodeParent(undefined)
  }

  function startEditing(item: Contribution) {
    setEditDraft({ id: item.id, title: item.title ?? '', body: item.body })
  }

  function saveEditing() {
    if (!editDraft) return
    onUpdateContribution(editDraft.id, {
      title: editDraft.title.trim(),
      body: editDraft.body.trim(),
    })
    setEditDraft(null)
  }

  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setEditDraft(null)
      return
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      saveEditing()
    }
  }

  return (
    <div className="tree-shell">
      <header className="tree-header">
        <div className="tree-header__left">
          <button type="button" className="icon-button" onClick={onBack} aria-label="Go back">←</button>
          <div><span className="tree-header__brand">CogniWeave</span><h1>{topic}</h1></div>
        </div>
        <div className="tree-header__actions">
          <span className="tree-save-state"><span className="status-dot" /> Saved</span>
          <button type="button" className="tree-add-button" onClick={() => openCreateNode(null)}>+ New branch</button>
        </div>
      </header>

      <div className="tree-workspace">
        <aside className="tree-sidebar">
          <span className="tree-sidebar__label">Discussion map</span>
          <strong>{contributions.filter((item) => item.parentId === null).length} branches</strong>
          <p>{contributions.length} ideas in this canvas</p>
          <div className="tree-sidebar__hint"><span>✦</span><p><strong>Make it yours</strong>Drag nodes, edit any text, or create a child to grow an idea.</p></div>
        </aside>

        <div
          ref={canvasRef}
          className="node-canvas"
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopInteraction}
          onWheel={handleWheel}
        >
          <div className="canvas-instructions">Drag to pan · Scroll to zoom · Double-click to edit</div>
          <div className="canvas-controls">
            <button type="button" onClick={() => zoomBy(0.12)} aria-label="Zoom in">+</button>
            <span>{Math.round(viewport.scale * 100)}%</span>
            <button type="button" onClick={() => zoomBy(-0.12)} aria-label="Zoom out">−</button>
            <button type="button" onClick={resetView} aria-label="Reset view">⌂</button>
          </div>

          <div className={`canvas-world${isInteracting ? ' canvas-world--interacting' : ''}`} style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}>
            <svg className="node-edges" width="1800" height="1200" aria-hidden="true">
              {visibleContributions.map((item) => {
                if (!item.parentId || hiddenIds.has(item.parentId)) return null
                const parent = resolvedPositions[item.parentId]
                const child = resolvedPositions[item.id]
                if (!parent || !child) return null
                const startX = parent.x + NODE_WIDTH / 2
                const startY = parent.y + NODE_HEIGHT
                const endX = child.x + NODE_WIDTH / 2
                const endY = child.y
                const middleY = (startY + endY) / 2
                return <path key={`${item.parentId}-${item.id}`} d={`M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`} />
              })}
            </svg>

            {visibleContributions.length === 0 && (
              <button type="button" className="canvas-empty-state" onClick={() => openCreateNode(null)}>
                <span>＋</span><strong>Start the discussion map</strong><small>Create the first branch, then add connected ideas.</small>
              </button>
            )}
            {visibleContributions.map((item) => {
              const point = resolvedPositions[item.id] ?? { x: 0, y: 0 }
              const children = childrenByParent.get(item.id) ?? []
              const isCollapsed = collapsedIds.has(item.id)
              return (
                <article
                  key={item.id}
                  className={`discussion-node discussion-node--${item.relation}${item.parentId === null ? ' discussion-node--root' : ''}`}
                  style={{ transform: `translate(${point.x}px, ${point.y}px)`, width: NODE_WIDTH, minHeight: NODE_HEIGHT }}
                  onPointerDown={(event) => handleNodePointerDown(event, item.id)}
                  onDoubleClick={() => startEditing(item)}
                >
                  <div className="discussion-node__topline">
                    <span className={`relation-pill relation-pill--${item.relation}`}>{item.parentId === null ? 'Branch' : item.relation}</span>
                    <span className="discussion-node__drag" aria-hidden="true">⠿</span>
                  </div>
                  {editDraft?.id === item.id ? (
                    <div className="discussion-node__editor">
                      <input
                        autoFocus
                        className="discussion-node__title"
                        value={editDraft.title}
                        placeholder="Idea title"
                        onChange={(event) => setEditDraft({ ...editDraft, title: event.target.value })}
                        onKeyDown={handleEditKeyDown}
                        aria-label="Node title"
                      />
                      <textarea
                        ref={editTextareaRef}
                        className="discussion-node__body"
                        value={editDraft.body}
                        placeholder="Add details…"
                        onChange={(event) => setEditDraft({ ...editDraft, body: event.target.value })}
                        onKeyDown={handleEditKeyDown}
                        aria-label="Node content"
                      />
                      <span className="discussion-node__edit-hint">Enter to save · Shift+Enter for a new line · Esc to cancel</span>
                    </div>
                  ) : (
                    <div className="discussion-node__copy">
                      <h2>{item.title?.trim() || (item.kind === 'branch' ? getBranchLabel(item) : 'Untitled idea')}</h2>
                      {item.body ? <p>{item.body}</p> : <p className="discussion-node__empty">Double-click to add details</p>}
                    </div>
                  )}
                  <div className="discussion-node__footer">
                    <span className="node-author"><span>{item.author.slice(0, 1)}</span>{item.author}</span>
                    <div>
                      {children.length > 0 && (
                        <button
                          type="button"
                          className="node-action"
                          onClick={() => setCollapsedIds((current) => {
                            const next = new Set(current)
                            if (next.has(item.id)) next.delete(item.id)
                            else next.add(item.id)
                            return next
                          })}
                          aria-label={isCollapsed ? 'Expand children' : 'Collapse children'}
                        >
                          {isCollapsed ? `+${children.length}` : '−'}
                        </button>
                      )}
                      <button type="button" className="node-action node-action--add" onClick={() => openCreateNode(item.id)} aria-label="Create child node">+</button>
                    </div>
                  </div>
                  <div className="discussion-node__hover-toolbar" aria-label="Node actions">
                    {editDraft?.id === item.id ? (
                      <>
                        <button type="button" onClick={saveEditing}>Save</button>
                        <button type="button" onClick={() => setEditDraft(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEditing(item)}>Edit</button>
                        <button type="button" onClick={() => openCreateNode(item.id)}>+ Child</button>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {newNodeParent !== undefined && (
        <div className="node-dialog-backdrop" role="presentation" onMouseDown={() => setNewNodeParent(undefined)}>
          <section className="node-dialog" role="dialog" aria-modal="true" aria-labelledby="node-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="quiz-kicker">{newNodeParent === null ? 'New discussion branch' : 'Build on this idea'}</span>
            <h2 id="node-dialog-title">Create {newNodeParent === null ? 'a branch' : 'a child node'}</h2>
            <label>Title<input autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Give this idea a clear title" /></label>
            <label>Content<textarea value={newBody} onChange={(event) => setNewBody(event.target.value)} placeholder="Explain the thought, question, or perspective…" /></label>
            <div className="node-dialog__actions">
              <button type="button" className="quiz-alternative" onClick={() => setNewNodeParent(undefined)}>Cancel</button>
              <button type="button" className="tree-add-button" onClick={saveNewNode} disabled={!newTitle.trim() && !newBody.trim()}>Create node</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
