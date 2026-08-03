export type Screen =
  | 'landing'
  | 'mode-selection'
  | 'preference-quiz'
  | 'chat'
  | 'tree'

export type DiscussionReturnScreen = 'landing' | 'mode-selection'

export type ContributionKind = 'message' | 'branch' | 'idea'

export type RelationType = 'idea' | 'support' | 'challenge' | 'question'

export type Contribution = {
  id: string
  kind: ContributionKind
  author: string
  title?: string
  body: string
  parentId: string | null
  relation: RelationType
  createdAt: number
}

export type RecommendedMode = 'talk' | 'organize'

export const DISCUSSION_TOPIC =
  'How should AI change university education?'

export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

export function sortByCreatedAt(a: Contribution, b: Contribution): number {
  return a.createdAt - b.createdAt
}

export function createInitialContributions(): Contribution[] {
  return [
    {
      id: 'contrib-emily-chat',
      kind: 'message',
      author: 'Emily',
      body: 'AI could personalize readings and pacing so students who need more time on fundamentals are not left behind.',
      parentId: null,
      relation: 'idea',
      createdAt: 1_000,
    },
    {
      id: 'contrib-jack-chat',
      kind: 'message',
      author: 'Jack',
      body: 'I worry about over-reliance—universities should teach when to use AI and when to think without it.',
      parentId: null,
      relation: 'challenge',
      createdAt: 2_000,
    },
    {
      id: 'contrib-amy-chat',
      kind: 'message',
      author: 'Amy',
      body: 'Maybe AI tutors handle drill practice while professors focus on debate, ethics, and creative projects.',
      parentId: null,
      relation: 'idea',
      createdAt: 3_000,
    },
    {
      id: 'contrib-branch-personalized',
      kind: 'branch',
      author: 'Emily',
      title: 'Personalized Learning',
      body: '',
      parentId: null,
      relation: 'idea',
      createdAt: 4_000,
    },
    {
      id: 'contrib-idea-personalized',
      kind: 'idea',
      author: 'Emily',
      body: 'Adaptive syllabi that adjust to each student’s strengths and gaps.',
      parentId: 'contrib-branch-personalized',
      relation: 'support',
      createdAt: 4_100,
    },
    {
      id: 'contrib-branch-tutors',
      kind: 'branch',
      author: 'Jack',
      title: 'AI Tutors',
      body: '',
      parentId: null,
      relation: 'idea',
      createdAt: 5_000,
    },
    {
      id: 'contrib-idea-tutors',
      kind: 'idea',
      author: 'Jack',
      body: '24/7 tutoring for problem sets with hints instead of full answers.',
      parentId: 'contrib-branch-tutors',
      relation: 'support',
      createdAt: 5_100,
    },
    {
      id: 'contrib-branch-integrity',
      kind: 'branch',
      author: 'Amy',
      title: 'Academic Integrity',
      body: '',
      parentId: null,
      relation: 'idea',
      createdAt: 6_000,
    },
    {
      id: 'contrib-idea-integrity',
      kind: 'idea',
      author: 'Amy',
      body: 'Clear policies on disclosure when AI assists writing or coding assignments.',
      parentId: 'contrib-branch-integrity',
      relation: 'question',
      createdAt: 6_100,
    },
  ]
}

export function getBranchLabel(branch: Contribution): string {
  return branch.title?.trim() || branch.body
}
