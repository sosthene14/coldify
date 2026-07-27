import { useState } from 'react'
import { Button, Stack, Text, ThemeIcon, Loader } from '@mantine/core'
import { IconMailCheck, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
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
    setResendMessage({ type: 'error', text: "Ce compte est déjà vérifié." })
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
        setResendMessage({ type: 'success', text: 'Email envoyé avec succès !' })
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
    setResendMessage({ type: 'error', text: error.message ?? "Erreur lors de l'envoi" })
  }
}

  if (status === 'success') {
      sessionStorage.removeItem('pendingVerificationEmail')

    return (
      <AuthLayout title="Email verified" subtitle="Your account is ready to go">
        <Stack align="center" gap="md" py="xl">
          <ThemeIcon color="blue" variant="light" radius="xl" size={56}>
            <IconCircleCheck size={28} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            Your email has been verified successfully.
          </Text>
          <Button color="blue" radius="md" fullWidth mt="sm" component="a" href="/login">
            Continue to log in
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  if (status === 'error') {
    return (
      <AuthLayout title="Verification failed" subtitle="This link may have expired">
        <Stack align="center" gap="md" py="xl">
          <ThemeIcon color="red" variant="light" radius="xl" size={56}>
            <IconCircleX size={28} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            We couldn't verify your email. The link may be invalid or expired.
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
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  // status === 'pending' — juste après l'inscription, en attente de clic
  return (
    <AuthLayout title="Check your inbox" subtitle="We've sent you a verification link">
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
              We sent a verification link to <Text span fw={500} c="dark.7">{email}</Text>.
              Click the link to activate your account.
            </>
          ) : (
            'Click the link we sent you to activate your account.'
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
          {resending ? <Loader size="xs" /> : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
        </Button>

        <Text size="xs" c="dimmed" ta="center">
          Wrong email?{' '}
          <Text span c="blue.6" style={{ cursor: 'pointer' }} onClick={() => window.history.back()}>
            Go back
          </Text>
        </Text>
      </Stack>
    </AuthLayout>
  )
}