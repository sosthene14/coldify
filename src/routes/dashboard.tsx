import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSession } from '#/lib/auth-client'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { t } = useTranslation()
  const { data: session, isPending } = useSession()


  if (isPending || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}