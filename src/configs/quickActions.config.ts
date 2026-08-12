import type { QuickAction } from '#/types/sidebar.ts';
import {
  IconCirclePlus,
  IconPlugConnected,

} from '@tabler/icons-react'


export const quickActions: QuickAction[] = [
  { key: 'create-campaign', label: 'Create mail', icon: IconCirclePlus },
  { key: 'connect-mailbox', label: 'Connect Mailbox', icon: IconPlugConnected },
]