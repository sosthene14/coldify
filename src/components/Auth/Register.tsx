// RegisterPage.tsx
import { useState } from 'react'
import { TextInput, PasswordInput, Button, Divider, Text, Anchor, Stack, Alert, Group, Checkbox } from '@mantine/core'

import { useRegister } from '#/hooks/useRegister.ts'
import { AuthLayout } from '../Layout/AuthLayout';
import { GoogleButton } from '../Layout/GoogleButton';
import { Link } from '@tanstack/react-router';

export function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, registerWithGoogle, loading, error } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (!acceptedTerms) {
      setFormError('You must accept the terms of service to continue')
      return
    }

    register({ firstName, lastName, organizationName, email, password })
  }

  return (
    <AuthLayout title="Create an account" subtitle="Start managing your campaigns in minutes">
      <Stack gap="sm">
        <GoogleButton label="Sign up with Google" onClick={registerWithGoogle} />

        <Divider label="or" labelPosition="center" color="gray.2" />

        {(error || formError) && (
          <Alert color="red" radius="md">
            {formError || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} >
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="First name"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                radius="md"
                required
              />
              <TextInput
                label="Last name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                radius="md"
                required
              />
            </Group>

            <Group grow>
              <TextInput
                label="Organization name"
                placeholder="Acme Inc."
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
                radius="md"
                required
              />
              <TextInput
                label="Email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                radius="md"
                required
              />
            </Group>

            <Group grow>
              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                radius="md"
                required
              />
              <PasswordInput
                label="Confirm password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                radius="md"
                required
              />
            </Group>

            <Checkbox
              mt="xs"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.currentTarget.checked)}
              label={
                <Text size="sm">
                  I agree to the{' '}
                  <Anchor size="sm" component={Link} to="/terms">
                    Terms of Service
                  </Anchor>{' '}
                  and{' '}
                  <Anchor size="sm" component={Link} to="/privacy">
                    Privacy Policy
                  </Anchor>
                </Text>
              }
              required
            />

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              Create account
            </Button>
          </Stack>
        </form>

        <Text size="sm" c="dimmed" ta="center">
          Already have an account?{' '}

          <Link className='text-blue-400' to="/login">
            Log in
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  )
}