// src/hooks/useRegister.ts
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client.ts'

export type RegisterFormValues = {
  firstName: string
  lastName: string
  organizationName: string
  email: string
  password: string
}

export function useRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (values: RegisterFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const { firstName, lastName, email, password } = values

      const {  error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/onboarding`,
      })

      if (signUpError) {
        setError(signUpError.message ?? "Une erreur est survenue lors de l'inscription")
        return
      }
sessionStorage.setItem('pendingVerificationEmail', email)
navigate({ 
  to: '/verify-email', 
  search: { email, error: false } 
})
    } catch {
      setError('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  const registerWithGoogle = async () => {
    setError(null)
    await authClient.signIn.social({ provider: 'google', callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/onboarding` })
  }

  return { register, registerWithGoogle, loading, error }
}