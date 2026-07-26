import { Dashboard } from '#/components/Dashboard/dashboard.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
})

 