import type { CampaignFilterItem } from '#/types/sidebar.ts';
import {
    IconAlertCircle,
    IconClock,
  IconFolder,
  IconLayoutGrid,
  IconSend,
  IconStar,
} from '@tabler/icons-react'



export const emailFilters: CampaignFilterItem[] = [
  { label: 'all_emails', count: 24, icon: IconLayoutGrid },
  { label: 'starred', count: 6, icon: IconStar },
  { label: 'drafts', count: 4, icon: IconFolder },
  { label: 'scheduled', count: 3, icon: IconClock },
  { label: 'sent', count: 15, icon: IconSend, iconColor: 'var(--mantine-color-blue-6)' },
  { label: 'failed', count: 2, icon: IconAlertCircle, iconColor: 'var(--mantine-color-red-6)' },
]


// constants/email.constants.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const EMAIL_CONSTANTS = {
  MAX_ATTACHMENT_SIZE: 25 * 1024 * 1024, // 25MB
  DANGEROUS_EXTENSIONS: [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr',
    '.vbs', '.js', '.jse', '.wsf', '.wsh', '.msi',
    '.msp', '.cpl', '.jar'
  ]
} as const