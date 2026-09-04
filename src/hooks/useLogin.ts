// src/hooks/useLogin.ts
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { authClient, twoFactor, setTwoFactorRedirectCallback, set2FAInProgress, is2FAInProgress } from '#/lib/auth-client.ts'
import toast from 'react-hot-toast'

export type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
}

export function useLogin() {
  const { t } = useTranslation()
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
      })

      if (signInError) {
        const errorMessage = signInError.message ?? t('incorrect_email_password')
        setError(errorMessage)
        throw new Error(errorMessage) // Lancer une exception
      }

      // Si on arrive ici sans 2FA redirect, login réussi
      // La redirection est gérée par __root.tsx useEffect
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('unexpected_error')
      setError(errorMessage)
      throw error // Relancer l'exception
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
        const errorMessage = res.error.message ?? t('invalid_code_retry')
        setError(errorMessage)
        throw new Error(errorMessage)
      }
      // Login réussi, la session est maintenant active
      // Marquer que 2FA est terminé
      set2FAInProgress(false)
      sessionStorage.removeItem('_2fa_methods')
      setRequires2FA(false)
      // La redirection est gérée par __root.tsx
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('totp_verification_failed')
      setError(errorMessage)
      throw error
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
        const errorMessage = res.error.message ?? t('invalid_email_code_retry')
        setError(errorMessage)
        throw new Error(errorMessage)
      }
      // Login réussi
      set2FAInProgress(false)
      sessionStorage.removeItem('_2fa_methods')
      setRequires2FA(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('email_otp_verification_failed')
      setError(errorMessage)
      throw error
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
        setError(res.error.message ?? t('unable_send_code'))
        return
      }
   
      toast.success(t('new_verification_code_sent'))
    } catch {
      setError(t('error_sending_code'))
    }
  }

  // Vérifier un backup code
  const verifyBackupCode = async (code: string) => {
    setTwoFactorLoading(true)
    setError(null)

    try {
      const res = await twoFactor.verifyBackupCode({ code })
      if (res.error) {
        setError(res.error.message ?? t('invalid_recovery_code'))
        return
      }
      set2FAInProgress(false)
      sessionStorage.removeItem('_2fa_methods')
      setRequires2FA(false)
    } catch {
      setError(t('recovery_code_verification_failed'))
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    await authClient.signIn.social({ 
      provider: 'google', 
      callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
    })
  }

  const forgotPassword = async (email: string) => {
    setError(null)

    if (!email) {
      setError(t('enter_email_reset'))
      return
    }

    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    if (resetError) {
      if (resetError.status === 429) {
        setError(t('too_many_attempts'))
      } else {
        setError(resetError.message ?? t('unable_send_reset_email'))
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