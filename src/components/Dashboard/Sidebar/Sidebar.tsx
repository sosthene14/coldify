import { ScrollArea, Stack } from '@mantine/core'
import { CampaignsCard } from './CampaignsCard'
import { EmailLimitCard } from './EmailLimitCard'
import { QuickActionsCard } from './QuickActionsCard'
import classes from './Sidebar.module.css'
import type { SidebarProps } from '#/types/sidebar.ts'

 const HEADER_OFFSET = 10

export function Sidebar({ emailSent, emailLimit, mailboxes, onQuickAction }: SidebarProps) {
  return (
    <div
    className='w-[200px] h-20   slate-50/10'
    >
      <Stack gap="sm" pb="sm">
        <CampaignsCard />
        <EmailLimitCard sent={emailSent} limit={emailLimit} />
        <QuickActionsCard onAction={onQuickAction} />
      </Stack>
    </div>
  )
}