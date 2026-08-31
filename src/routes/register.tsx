import { RegisterPage } from '#/components/Auth/Register.tsx'
import { useSession } from '#/lib/auth-client.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/register')({
  component: RegisterPageRoute,
})

function RegisterPageRoute() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (!isPending && session?.user) {
      navigate({ to: '/dashboard' })
    }
  }, [session, isPending])

  // Show nothing while checking or if already logged in
  if (isPending || session?.user) {
    return null
  }

  return <RegisterPage />
}