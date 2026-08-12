import { ScrollArea, Stack } from '@mantine/core'
import { CampaignsCard } from './CampaignsCard'
import { EmailLimitCard } from './EmailLimitCard'
import { QuickActionsCard } from './QuickActionsCard'
import classes from './Sidebar.module.css'
import type { SidebarProps } from '#/types/sidebar.ts'
import { ActivitySidebar } from '../activity-feed';

const HEADER_OFFSET = 10

export function Sidebar({ mailboxes, onQuickAction }: SidebarProps) {
  return (
    <div className='w-full h-20 slate-50/10'>
      <Stack gap="sm" pb="sm">
        <CampaignsCard />
         <ActivitySidebar />
        <EmailLimitCard />
        <QuickActionsCard onAction={onQuickAction} />
      </Stack>
    </div>
  )
}