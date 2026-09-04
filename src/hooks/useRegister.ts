// src/hooks/useRegister.ts
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { authClient } from '#/lib/auth-client.ts'

export type RegisterFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export function useRegister() {
  const { t } = useTranslation()
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
        callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
      })

      if (signUpError) {
        const errorMessage = signUpError.message ?? t('account_creation_error')
        setError(errorMessage)
        throw new Error(errorMessage)
      }
      
      sessionStorage.setItem('pendingVerificationEmail', email)
      navigate({ 
        to: '/verify-email', 
        search: { email, error: false } 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('unexpected_error')
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const registerWithGoogle = async () => {
    setError(null)
    await authClient.signIn.social({ provider: 'google', callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard` })
  }

  return { register, registerWithGoogle, loading, error }
}