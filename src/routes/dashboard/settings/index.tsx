import { SettingsPage } from '#/components/Settings/index.tsx'
import { createFileRoute } from '@tanstack/react-router'

type SettingsSearch = {
  section?: 'profile' | 'mailboxes' | 'subscription' | 'notifications' | 'security' | 'app'
}

export const Route = createFileRoute('/dashboard/settings/')({
  component: SettingsPage,
  validateSearch: (search: Record<string, unknown>): SettingsSearch => {
    return {
      section: (search.section as SettingsSearch['section']) || undefined
    }
  }
})

 
