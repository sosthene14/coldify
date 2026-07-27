import { Dashboard } from '#/components/Dashboard/dashboard.tsx';
import { DashboardSkeleton } from '#/components/Dashboard/DashboardSkeleton';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
  pendingComponent: DashboardSkeleton,
})