import { useState } from 'react'
import { Button, Stack, Text, ThemeIcon, Loader } from '@mantine/core'
import { IconMailCheck, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../Layout/AuthLayout';
import { useSearch } from '@tanstack/react-router';
import { authClient } from '#/lib/auth-client.ts';

type VerifyStatus = 'pending' | 'success' | 'error' | 'loading'

 // Le search param `status` vient du callbackURL Better Auth après clic sur le lien
type VerifyEmailSearch = {
  error: boolean
  email?: string
}

const RESEND_COOLDOWN = 30 // secondes

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const search = useSearch({ strict: false }) as VerifyEmailSearch
  const emailFromStorage = typeof window !== 'undefined' 
    ? sessionStorage.getItem('pendingVerificationEmail') 
    : null
  const email = search.email ?? emailFromStorage ?? undefined
  const { data: session } = authClient.useSession()
  const status: VerifyStatus = search.error ? 'error' : session?.user?.emailVerified ? 'success' : 'pending'

  const [cooldown, setCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)


  const handleResend = async () => {
    if (!email) return

    if (session?.user?.emailVerified) {
      setResendMessage({ type: 'error', text: t('account_already_verified') })
      return
    }

    setResending(true)
    const { error } = await authClient.sendVerificationEmail({
      email: email,
      callbackURL: '/verify-email?verified=true',
    })
    setResending(false)



    if (!error) {
      setCooldown(RESEND_COOLDOWN)
      setResendMessage({ type: 'success', text: t('email_sent_success') })
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval)
            return 0
          }
          return c - 1
        })
      }, 1000)
    }
    else {
      setResendMessage({ type: 'error', text: error.message ?? t('error_sending_email') })
    }
  }

  if (status === 'success') {
      sessionStorage.removeItem('pendingVerificationEmail')

    return (
      <AuthLayout title={t('email_verified_title')} subtitle={t('account_ready')}>
        <Stack align="center" gap="md" py="xl">
          <ThemeIcon color="blue" variant="light" radius="xl" size={56}>
            <IconCircleCheck size={28} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            {t('email_verified_success')}
          </Text>
          <Button color="blue" radius="md" fullWidth mt="sm" component="a" href="/login">
            {t('continue_to_log_in')}
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  if (status === 'error') {
    return (
      <AuthLayout title={t('verification_failed_title')} subtitle={t('link_may_expired')}>
        <Stack align="center" gap="md" py="xl">
          <ThemeIcon color="red" variant="light" radius="xl" size={56}>
            <IconCircleX size={28} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            {t('couldnt_verify_email')}
          </Text>
          <Button
            color="blue"
            radius="md"
            fullWidth
            mt="sm"
            onClick={handleResend}
            loading={resending}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? t('resend_in', { count: cooldown }) : t('resend_verification_email')}
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  // status === 'pending' — juste après l'inscription, en attente de clic
  return (
    <AuthLayout title={t('check_your_inbox')} subtitle={t('check_inbox_verification')}>
      <Stack align="center" gap="md" py="xl">
        <ThemeIcon color="blue" variant="light" radius="xl" size={56}>
          <IconMailCheck size={28} />
        </ThemeIcon>
        {resendMessage && (
          <Text size="xs" c={resendMessage.type === 'success' ? 'green.6' : 'red.6'} ta="center">
            {resendMessage.text}
          </Text>
        )}
        <Text size="sm" c="dimmed" ta="center">
          {email ? (
            <>
              {t('we_sent_verification_link', { email })}{' '}
              {t('click_link_activate')}
            </>
          ) : (
            t('click_link_sent_activate')
          )}
        </Text>

        <Button
          variant="default"
          color="gray"
          radius="md"
          fullWidth
          mt="sm"
          onClick={handleResend}
          loading={resending}
          disabled={cooldown > 0}
        >
          {resending ? <Loader size="xs" /> : cooldown > 0 ? t('resend_in', { count: cooldown }) : t('resend_email')}
        </Button>

        <Text size="xs" c="dimmed" ta="center">
          {t('wrong_email')}{' '}
          <Text span c="blue.6" style={{ cursor: 'pointer' }} onClick={() => window.history.back()}>
            {t('go_back')}
          </Text>
        </Text>
      </Stack>
    </AuthLayout>
  )
}