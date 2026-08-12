import { LoginPage } from '#/components/Auth/Login.tsx'
import { useSession } from '#/lib/auth-client.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPageRoute,
})

function LoginPageRoute() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (!isPending && session?.user) {
      navigate({ to: '/dashboard' })
    }
  }, [session, isPending, navigate])

  // Show nothing only if already logged in to prevent content flash during redirect
  if (session?.user) {
    return null
  }

  return <LoginPage />
}