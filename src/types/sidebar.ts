import type { Icon } from "@tabler/icons-react";

export interface CampaignFilterItem {
  label: string
  count: number
  icon: Icon
  iconColor?: string // pour les icônes "pleines" (points de statut)
}

export interface QuickAction {
  key: string
  label: string
  icon: Icon
}

export interface MailboxHealthItem {
  email: string
  score: number
}

export interface MailboxHealthCardProps {
  mailboxes: MailboxHealthItem[]
}


export interface SidebarProps {
  mailboxes: MailboxHealthItem[]
  onQuickAction?: (key: string) => void
}
