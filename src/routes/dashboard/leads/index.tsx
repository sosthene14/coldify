import { LeadsPage } from '#/components/Leads/Leads.tsx';
import { LeadsSkeleton } from '#/components/Leads/LeadsSkeleton.tsx';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/dashboard/leads/')({
  component: LeadsPage,
  pendingComponent: LeadsSkeleton,
})

