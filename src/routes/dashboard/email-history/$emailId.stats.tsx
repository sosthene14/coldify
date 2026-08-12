import { createFileRoute } from '@tanstack/react-router'
import { EmailStatsPage } from '../../../components/EmailHistory/EmailStatsPage'

export const Route = createFileRoute('/dashboard/email-history/$emailId/stats')({
  component: EmailStatsPage,
})
