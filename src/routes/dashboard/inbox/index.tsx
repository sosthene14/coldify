import { InboxPage } from '#/components/Inboxs/Inboxs.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/inbox/')({
  component: InboxPage,
})

 