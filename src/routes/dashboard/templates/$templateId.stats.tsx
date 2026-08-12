import { createFileRoute } from '@tanstack/react-router'
import { TemplateStatsPage } from '#/components/Templates/TemplateStatsPage'

export const Route = createFileRoute('/dashboard/templates/$templateId/stats')({
  component: TemplateStatsPage,
})
