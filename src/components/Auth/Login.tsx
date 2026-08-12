// LoginPage.tsx
import { useState } from 'react'
import { TextInput, PasswordInput, Button, Divider, Text, Anchor, Stack, Checkbox, Group, Alert, PinInput, SegmentedControl, Paper } from '@mantine/core'
import { IconArrowLeft, IconShieldCheck, IconKey, IconMail, IconLock } from '@tabler/icons-react'
import { AuthLayout } from '../Layout/AuthLayout';
import { GoogleButton } from '../Layout/GoogleButton';
import { useLogin } from '#/hooks/useLogin.ts'
import { Link } from '@tanstack/react-router';

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // 2FA verification method
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'otp' | 'backup'>('totp')

  const { 
    login, 
    loginWithGoogle, 
    forgotPassword, 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password, rememberMe })
  }

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault()
    if (!twoFactorCode || twoFactorCode.length < 6) return

    if (selectedMethod === 'totp') {
      verifyTOTP(twoFactorCode)
    } else if (selectedMethod === 'otp') {
      verifyEmailOTP(twoFactorCode)
    } else if (selectedMethod === 'backup') {
      verifyBackupCode(twoFactorCode)
    }
  }

  // ============ 2FA VERIFICATION SCREEN ============
  if (requires2FA) {
    const hasTotp = twoFactorMethods.includes('totp')
    const hasOtp = twoFactorMethods.includes('otp')

    return (
      <AuthLayout 
        title="Two-Factor Authentication" 
        subtitle="Enter the verification code to complete sign-in"
      >
        <Stack gap="md">
          <Paper p="md" radius="md" bg="blue.0" style={{ border: '1px solid #a5d8ff' }}>
            <Group gap="sm" wrap="nowrap">
              <IconShieldCheck size={24} color="#1971c2" />
              <Text size="sm" c="blue.8">
                Your account is protected by Two-Factor Authentication. 
                Please verify your identity to continue.
              </Text>
            </Group>
          </Paper>

          {error && (
            <Alert color="red" radius="md">
              {error}
            </Alert>
          )}

          {/* Method selector only if multiple methods available */}
          <SegmentedControl
            value={selectedMethod}
            onChange={(val: any) => {
              setSelectedMethod(val)
              setTwoFactorCode('')
            }}
            data={[
              ...(hasTotp ? [{ label: 'Authenticator App', value: 'totp' }] : []),
              ...(hasOtp ? [{ label: 'Email Code', value: 'otp' }] : []),
              { label: 'Backup Code', value: 'backup' },
            ]}
            fullWidth
            size="xs"
          />

          <form onSubmit={handleVerify2FA}>
            <Stack gap="sm">
              {selectedMethod === 'totp' && (
                <>
                  <Text size="sm" c="dimmed" ta="center">
                    Enter the 6-digit code from <strong>Google Authenticator</strong> or your 2FA app.
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
                    Enter the 6-digit code sent to your email address.
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
                    onClick={resendEmailOTP} 
                    fullWidth
                  >
                    Resend email code
                  </Button>
                </>
              )}

              {selectedMethod === 'backup' && (
                <>
                  <Text size="sm" c="dimmed" ta="center">
                    Enter one of your recovery backup codes.
                  </Text>
                  <TextInput
                    placeholder="Enter backup code"
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
                Verify & Sign In
              </Button>
            </Stack>
          </form>

          <Button 
            variant="subtle" 
            size="sm" 
            color="gray" 
            leftSection={<IconArrowLeft size={14} />}
            onClick={reset2FA}
            fullWidth
          >
            Back to login
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  // ============ NORMAL LOGIN SCREEN ============
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account to continue">
      <Stack gap="md" >
        <GoogleButton label="Continue with Google" onClick={loginWithGoogle} />

        <Divider label="or" labelPosition="center" color="gray.2" />

        {error && (
          <Alert color="red" radius="md" className='text-semibold'>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} >
          <Stack gap="sm">
            <TextInput
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              radius="md"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              radius="md"
              required
            />

            <Group justify="space-between" mt={-4}>
              <Checkbox
                label="Remember me"
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
  Forgot password?
</Anchor>
            </Group>

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              Log in
            </Button>
          </Stack>
        </form>

        <Text size="sm" c="dimmed" ta="center">
          Don't have an account?{' '}
          <Link  to="/register" className='text-blue-400'>
            Sign up
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  )
}