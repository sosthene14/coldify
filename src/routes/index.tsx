import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSession } from '#/lib/auth-client'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({ 
  component: Home 
})

function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (!isPending) {
      if (session?.user) {
        navigate({ to: '/dashboard' })
      } else {
        navigate({ to: '/login' })
      }
    }
  }, [session, isPending, navigate])

  // Show loading while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">{t('loading')}</p>
      </div>
    </div>
  )
}