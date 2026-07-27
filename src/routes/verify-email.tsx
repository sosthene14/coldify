import { VerifyEmailPage } from '#/components/VerifyEmail/VerifyEmailPage.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verify-email')({
    validateSearch: (search: Record<string, unknown>) => ({
    error: Boolean(search.error),
    email: typeof search.email === 'string' ? search.email : undefined,
  }),
  component: VerifyEmailPage
})
