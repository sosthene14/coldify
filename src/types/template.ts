export type CreationMode = 'manual' | 'html' | 'ai'
export type StepType = 'email' | 'linkedin' | 'task'
export type PreviewDevice = 'desktop' | 'mobile'

export interface SequenceStep {
  id: string
  type: StepType
  subject: string
  delayDays: number
  stopOnReply: boolean
}

export interface MergeTagGroup {
  label: string
  tags: string[]
}

export const mergeTagGroups: MergeTagGroup[] = [
  {
    label: 'Lead',
    tags: ['firstName', 'lastName', 'jobTitle', 'email'],
  },
  {
    label: 'Entreprise',
    tags: ['companyName', 'industry', 'companySize', 'companyWebsite'],
  },
  {
    label: 'Custom Fields',
    tags: ['currentSolution', 'techStack', 'annualRevenue'],
  },
]

export const categories = [
  'Professional',
  'Sales',
  'Marketing',
  'Follow-up',
  'Personal',
  'Transactional',
  'Newsletter',
  'Support',
  'Recruitment',
  'Networking',
]
export const languages = ['French', 'English', 'Spanish', 'German']
export const tones = ['Direct', 'Casual', 'Formal', 'Friendly', 'Bold']
export const lengths = ['Short (~50 words)', 'Medium (~100 words)', 'Long (~150 words)']
export const goals = ['Book a call', 'Get a reply', 'Drive a click', 'Build awareness']
export const previewLeads = ['John Doe - Acme Inc', 'Jane Smith - TechCo', 'Alice Williams - Agency Co']

export interface Template {
  id: string
  name: string
  subject: string
  body?: string // Optional for list view
  category: string
  language: string
  preview: string
  usageCount: number
  openRate: number | null
  replyRate: number | null
  starred?: boolean // Computed on frontend based on user's starred list
  createdAt: string
  updatedAt: string
  lastUsedAt?: string | null
  organizationId?: string
  ownerId?: string
  isPrivate?: boolean
}