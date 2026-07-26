import type { QuickAction } from '#/types/sidebar.ts';
import {
  IconCirclePlus,
  IconMailPlus,
  IconPlugConnected,
  IconUserPlus,
} from '@tabler/icons-react'


export const quickActions: QuickAction[] = [
  { key: 'create-campaign', label: 'Create Campaign', icon: IconCirclePlus },
  { key: 'add-leads', label: 'Add Leads', icon: IconUserPlus },
  { key: 'new-sequence', label: 'New Sequence', icon: IconMailPlus },
  { key: 'connect-mailbox', label: 'Connect Mailbox', icon: IconPlugConnected },
]