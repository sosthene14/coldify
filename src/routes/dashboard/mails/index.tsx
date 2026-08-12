import { createFileRoute } from '@tanstack/react-router'
import { EmailHistoryPage } from '#/components/EmailHistory/EmailHistoryPage'

export const Route = createFileRoute('/dashboard/mails/')({
  component: EmailHistoryPage,
})
