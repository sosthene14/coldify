// RegisterPage.tsx
import { useState, useEffect } from 'react'
import { TextInput, PasswordInput, Button, Divider, Text, Anchor, Stack, Group, Checkbox } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useRegister } from '#/hooks/useRegister.ts'
import { AuthLayout } from '../Layout/AuthLayout';
import { GoogleButton } from '../Layout/GoogleButton';
import { Link } from '@tanstack/react-router';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const { register, registerWithGoogle, loading, error } = useRegister()

  // Toast pour les erreurs du hook
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
      })
    }
  }, [error])

  // Toast pour le chargement
  useEffect(() => {
    let toastId: string | undefined;
    
    if (loading) {
      toastId = toast.loading(t('account_creation_loading'), {
        position: 'top-center',
      })
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }, [loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validations avec toasts
    if (!firstName || !lastName) {
      toast.error(t('enter_name'), {
        position: 'top-center',
      })
      return
    }

    if (!organizationName) {
      toast.error(t('enter_organization'), {
        position: 'top-center',
      })
      return
    }

    if (!email) {
      toast.error(t('enter_email'), {
        position: 'top-center',
      })
      return
    }

    if (password.length < 8) {
      toast.error(t('password_min_length'), {
        position: 'top-center',
      })
      return
    }

    if (password !== confirmPassword) {
      toast.error(t('password_mismatch'), {
        duration: 4000,
        position: 'top-center',
      })
      return
    }

    if (!acceptedTerms) {
      toast.error(t('accept_terms_required'), {
        duration: 4000,
        position: 'top-center',
      })
      return
    }

    // Appel à la fonction register avec promesse pour les toasts
    toast.promise(
      register({ firstName, lastName, organizationName, email, password }),
      {
        loading: t('creating_account'),
        success: t('account_created'),
        error: t('account_creation_error'),
      },
      {
        position: 'top-center',
      }
    )
  }

  const handleGoogleRegister = () => {
    toast.promise(
      registerWithGoogle(),
      {
        loading: t('google_register_loading'),
        success: t('google_register_success'),
        error: t('google_register_error'),
      },
      {
        position: 'top-center',
      }
    )
  }

  return (
    <AuthLayout title={t('create_account')} subtitle={t('start_managing_campaigns')}>
      <Stack gap="sm">
        <GoogleButton label={t('sign_up_with_google')} onClick={handleGoogleRegister} />

        <Divider label={t('or')} labelPosition="center" color="gray.2" />

        <form onSubmit={handleSubmit}>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label={t('first_name')}
                placeholder={t('jane')}
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                radius="md"
                required
              />
              <TextInput
                label={t('last_name')}
                placeholder={t('doe')}
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                radius="md"
                required
              />
            </Group>

            <Group grow>
              <TextInput
                label={t('organization_name')}
                placeholder={t('acme_inc')}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
                radius="md"
                required
              />
              <TextInput
                label={t('email')}
                placeholder={t('you_company_com')}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                radius="md"
                required
              />
            </Group>

            <Group grow>
              <PasswordInput
                label={t('password')}
                placeholder={t('create_password')}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                radius="md"
                required
              />
              <PasswordInput
                label={t('confirm_password')}
                placeholder={t('confirm_your_password')}
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
                  {t('i_agree_to')}{' '}
                  <Anchor size="sm" component={Link} to="/terms">
                    {t('terms_of_service')}
                  </Anchor>{' '}
                  {t('and')}{' '}
                  <Anchor size="sm" component={Link} to="/privacy">
                    {t('privacy_policy')}
                  </Anchor>
                </Text>
              }
              required
            />

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              {t('create_account_button')}
            </Button>
          </Stack>
        </form>

        <Text size="sm" c="dimmed" ta="center">
          {t('already_have_account')}{' '}
          <Link className='text-blue-400' to="/login">
            {t('log_in')}
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  )
}