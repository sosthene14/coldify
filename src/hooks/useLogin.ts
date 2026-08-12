// src/hooks/useLogin.ts
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { authClient, twoFactor, setTwoFactorRedirectCallback, set2FAInProgress, is2FAInProgress } from '#/lib/auth-client.ts'

export type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
}

export function useLogin() {
  const searchParams = useSearch({ strict: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2FA States - initialiser depuis sessionStorage
  const [requires2FA, setRequires2FA] = useState(() => is2FAInProgress())
  const [twoFactorMethods, setTwoFactorMethods] = useState<string[]>(() => {
    const stored = sessionStorage.getItem('_2fa_methods')
    return stored ? JSON.parse(stored) : []
  })
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  // Get redirect URL from query params or default to dashboard
  const getRedirectUrl = () => {
    const redirect = (searchParams as any)?.redirect
    return redirect && typeof redirect === 'string' ? redirect : '/dashboard'
  }

  // Register callback pour la redirection 2FA
  const handle2FARedirect = useCallback((methods: string[]) => {
    // Stocker les méthodes dans sessionStorage
    sessionStorage.setItem('_2fa_methods', JSON.stringify(methods))
    setRequires2FA(true)
    setTwoFactorMethods(methods)
    setLoading(false)
  }, [])

  useEffect(() => {
    setTwoFactorRedirectCallback(handle2FARedirect)
    return () => setTwoFactorRedirectCallback(null)
  }, [handle2FARedirect])

  // Synchroniser avec les changements d'état 2FA
  useEffect(() => {
    const handleStatusChange = () => {
      const inProgress = is2FAInProgress()
      setRequires2FA(inProgress)
      
      if (inProgress) {
        const stored = sessionStorage.getItem('_2fa_methods')
        if (stored) {
          setTwoFactorMethods(JSON.parse(stored))
        }
      }
    }

    window.addEventListener('2fa-status-changed', handleStatusChange)
    return () => window.removeEventListener('2fa-status-changed', handleStatusChange)
  }, [])

  const login = async ({ email, password, rememberMe }: LoginFormValues) => {
    setLoading(true)
    setError(null)
    setRequires2FA(false)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      }, {
        dontNavigate: true,
      })

      if (signInError) {
        setError(signInError.message ?? 'Email ou mot de passe incorrect')
        return
      }

      // Si on arrive ici sans 2FA redirect, login réussi
      // La redirection est gérée par __root.tsx useEffect
    } catch (err) {
      setError('Une erreur inattendue est survenue')
    } finally {
      // Le loading sera mis à false par handle2FARedirect si 2FA requis
      if (!requires2FA) {
        setLoading(false)
      }
    }
  }

  // Vérifier le code 2FA TOTP (Google Authenticator)
  const verifyTOTP = async (code: string) => {
    setTwoFactorLoading(true)
    setError(null)

    try {
      const res = await twoFactor.verifyTotp({ code })
      if (res.error) {
        setError(res.error.message ?? 'Code invalide. Réessayez.')
        return
      }
      // Login réussi, la session est maintenant active
      // Marquer que 2FA est terminé
      set2FAInProgress(false)
      sessionStorage.removeItem('_2fa_methods')
      setRequires2FA(false)
      // La redirection est gérée par __root.tsx
    } catch {
      setError('Échec de la vérification du code TOTP')
    } finally {
      setTwoFactorLoading(false)
    }
  }

  // Vérifier le code 2FA Email OTP
  const verifyEmailOTP = async (code: string) => {
    setTwoFactorLoading(true)
    setError(null)

    try {
      const res = await twoFactor.verifyOtp({ code })
      if (res.error) {
        setError(res.error.message ?? 'Code email invalide. Réessayez.')
        return
      }
      // Login réussi
      set2FAInProgress(false)
      sessionStorage.removeItem('_2fa_methods')
      setRequires2FA(false)
    } catch {
      setError('Échec de la vérification du code Email OTP')
    } finally {
      setTwoFactorLoading(false)
    }
  }

  // Demander un nouveau code OTP par email
  const resendEmailOTP = async () => {
    setError(null)
    try {
      const res = await twoFactor.sendOtp()
      if (res.error) {
        setError(res.error.message ?? "Impossible d'envoyer le code")
        return
      }
      // Succès - afficher une notification
      const { notifications } = await import('@mantine/notifications')
      notifications.show({
        title: 'Code envoyé',
        message: 'Un nouveau code de vérification a été envoyé à votre email',
        color: 'green',
      })
    } catch {
      setError("Erreur lors de l'envoi du code")
    }
  }

  // Vérifier un backup code
  const verifyBackupCode = async (code: string) => {
    setTwoFactorLoading(true)
    setError(null)

    try {
      const res = await twoFactor.verifyBackupCode({ code })
      if (res.error) {
        setError(res.error.message ?? 'Code de récupération invalide')
        return
      }
      set2FAInProgress(false)
      sessionStorage.removeItem('_2fa_methods')
      setRequires2FA(false)
    } catch {
      setError('Échec de la vérification du code de récupération')
    } finally {
      setTwoFactorLoading(false)
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

  const reset2FA = () => {
    setRequires2FA(false)
    setTwoFactorMethods([])
    setTwoFactorCode('')
    setError(null)
    set2FAInProgress(false)
    sessionStorage.removeItem('_2fa_methods')
  }

  return { 
    login, 
    loginWithGoogle, 
    forgotPassword, 
    loading, 
    error,
    // 2FA
    requires2FA,
    twoFactorMethods,
    twoFactorCode,
    setTwoFactorCode,
    twoFactorLoading,
    verifyTOTP,
    verifyEmailOTP,
    resendEmailOTP,
    verifyBackupCode,
    reset2FA,
  }
}