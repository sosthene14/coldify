import { Stack } from '@mantine/core'
import { CampaignsCard } from './CampaignsCard'
import { EmailLimitCard } from './EmailLimitCard'
import { QuickActionsCard } from './QuickActionsCard'
import type { SidebarProps } from '#/types/sidebar.ts'
import { ActivitySidebar } from '../activity-feed';


export function Sidebar({onQuickAction }: SidebarProps) {
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