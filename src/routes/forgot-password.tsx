import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '#/components/ForgotPassword/ForgotPasswordPage.tsx';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

 