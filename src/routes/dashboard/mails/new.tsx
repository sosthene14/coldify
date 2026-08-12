import { createFileRoute } from '@tanstack/react-router'
import { ComposeEmailPage } from '#/components/ComposeEmail/ComposeEmailPage'

export const Route = createFileRoute('/dashboard/mails/new')({
  component: ComposeEmailPage,
})
