// LoginPage.tsx
import { useState, useEffect } from 'react'
import { TextInput, PasswordInput, Button, Divider, Text, Anchor, Stack, Checkbox, Group, PinInput, SegmentedControl, Paper } from '@mantine/core'
import { IconArrowLeft, IconShieldCheck } from '@tabler/icons-react'
import { AuthLayout } from '../Layout/AuthLayout';
import { GoogleButton } from '../Layout/GoogleButton';
import { useLogin } from '#/hooks/useLogin.ts'
import { Link } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
const { t } = useTranslation()

  // 2FA verification method
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'otp' | 'backup'>('totp')

  const { 
    login, 
    loginWithGoogle, 
    loading, 
    error,
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
  } = useLogin()

  // Toast pour les erreurs
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
      })
    }
  }, [error])

  // Toast pour les chargements
  useEffect(() => {
    let toastId: string | undefined;
    
    if (loading || twoFactorLoading) {
    toastId = toast.loading(requires2FA ? t('verification_in_progress') : t('login_in_progress'), {
  position: 'top-center',
})
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }, [loading, twoFactorLoading, requires2FA])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
   if (!email || !password) {
  toast.error(t('please_fill_all_fields'), {
    position: 'top-center',
  })
  return
}
    
    login({ email, password, rememberMe })
  }

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault()
if (!twoFactorCode || twoFactorCode.length < 6) {
  toast.error(t('please_enter_valid_code'), {
    position: 'top-center',
  })
  return
}

    if (selectedMethod === 'totp') {
      verifyTOTP(twoFactorCode)
    } else if (selectedMethod === 'otp') {
      verifyEmailOTP(twoFactorCode)
    } else if (selectedMethod === 'backup') {
      verifyBackupCode(twoFactorCode)
    }
  }

  const handleGoogleLogin = () => {
  toast.promise(
    loginWithGoogle(),
    {
      loading: t('google_login_loading'),
      success: t('google_redirect'),
      error: t('google_login_error'),
    },
    {
      position: 'top-center',
    }
  )
}

const handleResendOTP = () => {
  toast.promise(
    resendEmailOTP(),
    {
      loading: t('sending_code'),
      success: t('code_sent_success'),
      error: t('code_send_error'),
    },
    {
      position: 'top-center',
    }
  )
}
  // ============ 2FA VERIFICATION SCREEN ============
  if (requires2FA) {
    const hasTotp = twoFactorMethods.includes('totp')
    const hasOtp = twoFactorMethods.includes('otp')

    return (
   <AuthLayout 
  title={t('two_factor_title')} 
  subtitle={t('two_factor_subtitle')}
>
  <Stack gap="md">
    <Paper p="md" radius="md" bg="blue.0" style={{ border: '1px solid #a5d8ff' }}>
      <Group gap="sm" wrap="nowrap">
        <IconShieldCheck size={24} color="#1971c2" />
        <Text size="sm" c="blue.8">
          {t('two_factor_protected_message')}
        </Text>
      </Group>
    </Paper>

    {/* Method selector only if multiple methods available */}
    <SegmentedControl
      value={selectedMethod}
      onChange={(val: any) => {
        setSelectedMethod(val)
        setTwoFactorCode('')
      }}
      data={[
        ...(hasTotp ? [{ label: t('authenticator_app'), value: 'totp' }] : []),
        ...(hasOtp ? [{ label: t('email_code'), value: 'otp' }] : []),
        { label: t('backup_code'), value: 'backup' },
      ]}
      fullWidth
      size="xs"
    />

    <form onSubmit={handleVerify2FA}>
      <Stack gap="sm">
        {selectedMethod === 'totp' && (
          <>
            <Text size="sm" c="dimmed" ta="center">
              {t('enter_6digit_code_from')} <strong>{t('google_authenticator')}</strong> {t('or_your_2fa_app')}
            </Text>
            <Group justify="center">
              <PinInput 
                length={6} 
                type="number"
                value={twoFactorCode} 
                onChange={setTwoFactorCode}
                size="lg"
                autoFocus
              />
            </Group>
          </>
        )}

        {selectedMethod === 'otp' && (
          <>
            <Text size="sm" c="dimmed" ta="center">
              {t('enter_6digit_code_sent')}
            </Text>
            <Group justify="center">
              <PinInput 
                length={6} 
                type="number"
                value={twoFactorCode} 
                onChange={setTwoFactorCode}
                size="lg"
                autoFocus
              />
            </Group>
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={handleResendOTP} 
              fullWidth
            >
              {t('resend_email_code')}
            </Button>
          </>
        )}

        {selectedMethod === 'backup' && (
          <>
            <Text size="sm" c="dimmed" ta="center">
              {t('enter_recovery_backup_code')}
            </Text>
            <TextInput
              placeholder={t('enter_backup_code_placeholder')}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.currentTarget.value)}
              styles={{ input: { textAlign: 'center', fontFamily: 'monospace', letterSpacing: 2 } }}
            />
          </>
        )}

        <Button 
          type="submit" 
          color="blue" 
          radius="md" 
          fullWidth 
          mt="xs" 
          loading={twoFactorLoading}
          disabled={!twoFactorCode || twoFactorCode.length < 6}
        >
          {t('verify_and_sign_in')}
        </Button>
      </Stack>
    </form>

    <Button 
      variant="subtle" 
      size="sm" 
      color="gray" 
      leftSection={<IconArrowLeft size={14} />}
      onClick={() => {
        reset2FA()
        toast.success(t('back_to_login_toast'), {
          position: 'top-center',
          duration: 2000,
        })
      }}
      fullWidth
    >
      {t('back_to_login')}
    </Button>
  </Stack>
</AuthLayout>
    )
  }

  // ============ NORMAL LOGIN SCREEN ============
  return (
  <AuthLayout title={t('welcome_back')} subtitle={t('log_in_to_continue')}>
  <Stack gap="md">
    <GoogleButton label={t('continue_with_google')} onClick={handleGoogleLogin} />

    <Divider label={t('or')} labelPosition="center" color="gray.2" />

    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <TextInput
          label={t('email')}
          placeholder={t('you_company_com')}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          radius="md"
          required
        />
        <PasswordInput
          label={t('password')}
          placeholder={t('your_password')}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          radius="md"
          required
        />

        <Group justify="space-between" mt={-4}>
          <Checkbox
            label={t('remember_me')}
            size="xs"
            color="blue"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.currentTarget.checked)}
          />
          <Anchor
            size="xs"
            c="blue.6"
            underline="never"
            component={Link}
            to="/forgot-password"
          >
            {t('forgot_password')}
          </Anchor>
        </Group>

        <Button 
          type="submit" 
          color="blue" 
          radius="md" 
          fullWidth 
          mt="xs" 
          loading={loading}
        >
          {t('log_in')}
        </Button>
      </Stack>
    </form>

    <Text size="sm" c="dimmed" ta="center">
      {t('dont_have_account')}{' '}
      <Link to="/register" className='text-blue-400'>
        {t('sign_up')}
      </Link>
    </Text>
  </Stack>
</AuthLayout>
  )
}