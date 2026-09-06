import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/Legal/LegalPage'

export const Route = createFileRoute('/privacy')({
  component: () => <LegalPage type="privacy" />,
})