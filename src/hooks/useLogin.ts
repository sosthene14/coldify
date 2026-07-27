// src/hooks/useLogin.ts
import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client.ts'

export type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
}

export function useLogin() {
  const searchParams = useSearch({ strict: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get redirect URL from query params or default to dashboard
  const getRedirectUrl = () => {
    const redirect = (searchParams as any)?.redirect
    return redirect && typeof redirect === 'string' ? redirect : '/dashboard'
  }

  const login = async ({ email, password, rememberMe }: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      })

      if (signInError) {
        setError(signInError.message ?? 'Email ou mot de passe incorrect')
        return
      }

    //   const redirectUrl = getRedirectUrl()
    //   navigate({ to: redirectUrl as any })
    } catch {
      setError('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    const redirectUrl = getRedirectUrl()
    await authClient.signIn.social({ 
      provider: 'google', 
      callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
    })
  }

  const forgotPassword = async (email: string) => {
    setError(null)

    if (!email) {
      setError('Entre ton email pour réinitialiser ton mot de passe')
      return
    }

    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    if (resetError) {
      if (resetError.status === 429) {
        setError('Trop de tentatives, réessaie dans quelques minutes')
      } else {
        setError(resetError.message ?? "Impossible d'envoyer l'email de réinitialisation")
      }
    }
  }

  return { login, loginWithGoogle, forgotPassword, loading, error }
}