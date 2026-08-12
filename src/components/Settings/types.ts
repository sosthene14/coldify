export type Section =
  | 'profile'
  | 'mailboxes'
  | 'domain'
  | 'team'
  | 'notifications'
  | 'integrations'
  | 'billing'
  | 'customFields'
  | 'compliance'
  | 'security'
  | 'app'

export interface NavItem {
  section: Section
  label: string
  icon: any
}

export interface Mailbox {
  email: string
  provider: string
  status: 'connected' | 'error'
  dailyLimit: number
  warmup: number
}
