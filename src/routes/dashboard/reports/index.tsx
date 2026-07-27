import { ReportsPage } from '#/components/Reports/Reports.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports/')({
  component: ReportsPage,
})

 