// LoginPage.tsx
import { useState } from 'react'
import { TextInput, PasswordInput, Button, Divider, Text, Anchor, Stack, Checkbox, Group, Alert, NavLink } from '@mantine/core'
import { AuthLayout } from '../Layout/AuthLayout';
import { GoogleButton } from '../Layout/GoogleButton';
import { useLogin } from '#/hooks/useLogin.ts'
import { Link } from '@tanstack/react-router';

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { login, loginWithGoogle, forgotPassword, loading, error } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password, rememberMe })
  }

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