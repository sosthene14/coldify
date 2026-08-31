import type { QuickAction } from '#/types/sidebar.ts';
import {
  IconCirclePlus,
  IconPlugConnected,

} from '@tabler/icons-react'


export const quickActions: QuickAction[] = [
  { key: 'create-campaign', label: 'create_mail', icon: IconCirclePlus },
  { key: 'connect-mailbox', label: 'connect_mailbox', icon: IconPlugConnected },
]