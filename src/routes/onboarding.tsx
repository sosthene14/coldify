import { OnboardingPage } from '#/components/Onboarding/OnboardingPage.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})