import { createFileRoute } from '@tanstack/react-router'

import { LeadDetailSkeleton } from '#/components/Leads/LeadDetailSkeleton'
import { LeadDetailPage } from '#/components/Leads/LeadDetails'

export const Route = createFileRoute('/dashboard/leads/$leadId')({
  component: LeadDetailPage,
  pendingComponent: LeadDetailSkeleton,
})

