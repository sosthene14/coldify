import { createFileRoute } from '@tanstack/react-router'
import { ImportLeads } from '#/components/Leads'

export const Route = createFileRoute('/dashboard/leads/import')({
  component: ImportLeadsPage,
})

function ImportLeadsPage() {
  return (
    <div className="bg-slate-50/10 min-h-screen">
      <ImportLeads />
    </div>
  )
}
