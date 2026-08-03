import { type FormEvent } from 'react'
import type { Contribution } from '../types/discussion'
import { getBranchLabel } from '../types/discussion'

type TreeViewProps = {
  topic: string
  branches: Contribution[]
  getIdeasForBranch: (branchId: string) => Contribution[]
  branchDraft: string
  onBranchDraftChange: (value: string) => void
  onAddBranch: (event: FormEvent<HTMLFormElement>) => void
  onBack: () => void
}

export function TreeView({
  topic,
  branches,
  getIdeasForBranch,
  branchDraft,
  onBranchDraftChange,
  onAddBranch,
  onBack,
}: TreeViewProps) {
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

        <ul className="tree-list">
          {branches.map((branch) => {
            const ideas = getIdeasForBranch(branch.id)
            return (
              <li key={branch.id} className="tree-branch">
                <h2 className="tree-branch__title">{getBranchLabel(branch)}</h2>
                {ideas.length > 0 && (
                  <ul className="tree-branch__children">
                    {ideas.map((idea) => (
                      <li key={idea.id} className="tree-child">
                        <span className="tree-child__meta">
                          {idea.author} · {idea.relation}
                        </span>
                        {idea.body}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>

        <form className="composer" onSubmit={onAddBranch}>
          <input
            type="text"
            className="composer__input"
            placeholder="New branch name…"
            value={branchDraft}
            onChange={(event) => onBranchDraftChange(event.target.value)}
            aria-label="Branch name"
          />
          <button type="submit" className="composer__submit">
            Add Branch
          </button>
        </form>
      </div>
    </div>
  )
}
