import { useState, useEffect } from 'react'
import {
  Card,
  Stack,
  Divider,
  Group,
  Text,
  Badge,
  Button,
  Loader,
  Modal,
  TextInput,
  PasswordInput,
  Alert,
  SegmentedControl,
  Paper,
  ActionIcon,
  Tooltip,
  CopyButton,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { 
  IconDeviceLaptop, 
  IconDeviceDesktop, 
  IconDeviceMobile,
  IconShieldCheck,
  IconCopy,
  IconCheck,
  IconAlertTriangle
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { SectionHeader } from '../components/SectionHeader'
import { api } from '#/lib/api'
import { useSession, twoFactor } from '#/lib/auth-client'
import toast from 'react-hot-toast'

interface Session {
  id: string
  device: string
  location: string
  ipAddress: string | null
  createdAt: string
  current: boolean
}

export function SecuritySection() {
  const { t } = useTranslation()
  const { data: sessionData, refetch } = useSession()
  const is2FAEnabled = Boolean(sessionData?.user?.twoFactorEnabled)

  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  // 2FA Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [setupStep, setSetupStep] = useState<'method' | 'totp' | 'email' | 'backup' | 'disable'>('method')
  const [twoFactorMethod, setTwoFactorMethod] = useState<'totp' | 'email'>('totp')
  
  const [password, setPassword] = useState('')
  const [totpURI, setTotpURI] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Charger les sessions au mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await api.get('/user/sessions')
        setSessions(response.data.sessions)
      } catch (error: any) {
        console.error('Failed to load sessions:', error)
      } finally {
        setLoadingSessions(false)
      }
    }
    loadSessions()
  }, [])

 

  // Ouvrir le modal d'activation
  const handleOpenEnableModal = () => {
    setErrorMessage(null)
    setPassword('')
    setVerificationCode('')
    setSetupStep('method')
    setIsModalOpen(true)
  }

  // Ouvrir le modal de désactivation
  const handleOpenDisableModal = () => {
    setErrorMessage(null)
    setPassword('')
    setSetupStep('disable')
    setIsModalOpen(true)
  }

  // Générer les informations TOTP (Google Authenticator)
  const handleStartTOTPSetup = async () => {
    if (!password) {
      setErrorMessage(t('enter_password_continue'))
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.enable({ password })
      if (res.error) {
        setErrorMessage(res.error.message || t('incorrect_password_or_error'))
        return
      }

      if (res.data) {
        setTotpURI(res.data.totpURI || '')
        setTotpSecret(res.data.totpURI?.split('secret=')[1]?.split('&')[0] || '')
        setBackupCodes(res.data.backupCodes || [])
      }
      setSetupStep('totp')
    } catch (err: any) {
      setErrorMessage(err.message || t('unable_generate_totp_qr'))
    } finally {
      setActionLoading(false)
    }
  }

  // Démarrer la configuration Email OTP
const handleStartEmailOTPSetup = async () => {
    if (!password) {
      setErrorMessage(t('enter_password_continue'))
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const enableRes = await twoFactor.enable({ password })
      if (enableRes.error) {
        setErrorMessage(enableRes.error.message || t('incorrect_password'))
        return
      }

      const sendRes = await twoFactor.sendOtp()
      if (sendRes.error) {
        setErrorMessage(sendRes.error.message || t('unable_send_otp_email'))
        return
      }

      toast.success(t('verification_code_sent_email'))
      setSetupStep('email')
    } catch (err: any) {
      setErrorMessage(err.message || t('error_sending_otp'))
    } finally {
      setActionLoading(false)
    }
  }

  // Vérifier et activer TOTP
  const handleVerifyTOTP = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setErrorMessage(t('enter_6digit_auth_code'))
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.verifyTotp({ code: verificationCode })
      if (res.error) {
        setErrorMessage(res.error.message || t('invalid_code'))
        return
      }

      toast.success(t('google_auth_activated'))
      if (backupCodes.length > 0) {
        setSetupStep('backup')
      } else {
        setIsModalOpen(false)
        refetch?.()
      }
    } catch (err: any) {
      setErrorMessage(err.message || t('totp_verification_failed'))
    } finally {
      setActionLoading(false)
    }
  }

  // Vérifier et activer Email OTP
  const handleVerifyEmailOTP = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setErrorMessage(t('enter_6digit_email_code_received'))
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.verifyOtp({ code: verificationCode })
      if (res.error) {
        setErrorMessage(res.error.message || t('invalid_email_code'))
        return
      }

      toast.success(t('email_2fa_activated'))
      setIsModalOpen(false)
      refetch?.()
    } catch (err: any) {
      setErrorMessage(err.message || t('email_otp_verification_failed'))
    } finally {
      setActionLoading(false)
    }
  }

  // Désactiver la 2FA
  const handleDisable2FA = async () => {
    if (!password) {
      setErrorMessage(t('enter_password_disable'))
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.disable({ password })
      if (res.error) {
        setErrorMessage(res.error.message || t('incorrect_password'))
        return
      }

      toast.success(t('two_factor_disabled'))
      setIsModalOpen(false)
      refetch?.()
    } catch (err: any) {
      setErrorMessage(err.message || t('unable_disable_2fa'))
    } finally {
      setActionLoading(false)
    }
  }
  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <IconDeviceMobile size={16} color="#868E96" />
    }
    if (device.toLowerCase().includes('macbook') || device.toLowerCase().includes('windows')) {
      return <IconDeviceDesktop size={16} color="#868E96" />
    }
    return <IconDeviceLaptop size={16} color="#868E96" />
  }

  const qrCodeUrl = totpURI 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpURI)}`
    : ''

  return (
    <>
      <Card withBorder radius="md" p="lg" bg="white">
        <SectionHeader 
          title={t('two_factor_auth_2fa')} 
          description={t('add_extra_security')}
        />
        <Divider my="md" />
        
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <Paper 
              p="xs" 
              radius="md" 
              bg={is2FAEnabled ? 'green.0' : 'gray.0'}
              style={{ border: `1px solid ${is2FAEnabled ? '#b2f2bb' : '#e9ecef'}` }}
            >
              <IconShieldCheck size={24} color={is2FAEnabled ? '#2b8a3e' : '#868e96'} />
            </Paper>
            <div>
              <Group gap="xs">
                <Text fw={600} size="sm">
                  {is2FAEnabled ? t('two_factor_enabled_status') : t('two_factor_disabled_status')}
                </Text>
                <Badge color={is2FAEnabled ? 'green' : 'gray'} variant="light" size="sm">
                  {is2FAEnabled ? t('active') : t('off')}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {is2FAEnabled 
                  ? t('account_protected_2fa') 
                  : t('protect_account_2fa')}
              </Text>
            </div>
          </Group>

          {is2FAEnabled ? (
            <Button variant="outline" color="red" size="xs" onClick={handleOpenDisableModal}>
              {t('disable_2fa')}
            </Button>
          ) : (
            <Button color="blue" size="xs" onClick={handleOpenEnableModal}>
              {t('enable_2fa')}
            </Button>
          )}
        </Group>
      </Card>

      <Card withBorder radius="md" p="lg" bg="white">
        <SectionHeader title={t('active_sessions')} description={t('manage_devices')} />
        <Divider my="md" />
        
        {loadingSessions ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">{t('loading_sessions')}</Text>
          </Group>
        ) : (
          <Stack gap="sm">
            {sessions.map((s) => (
              <Group key={s.id} justify="space-between">
                <Group gap={8}>
                  {getDeviceIcon(s.device)}
                  <div>
                    <Text size="sm" fw={500}>{s.device}</Text>
                    <Text size="xs" c="dimmed">
                      {s.location && s.location !== 'Unknown' && s.location !== 'Unknown location' ? `${s.location} • ` : ''}
                      {s.ipAddress || '127.0.0.1'} • {new Date(s.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                </Group>
                {s.current ? (
                  <Badge size="sm" variant="light" color="green">
                    {t('this_device')}
                  </Badge>
                ) : (
                  null
                )}
              </Group>
            ))}
            {sessions.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" py="md">
                {t('no_active_sessions')}
              </Text>
            )}
          </Stack>
        )}
      </Card>

      {/* MODAL CONFIGURATION 2FA */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Text fw={700} size="md">
            {setupStep === 'disable' ? t('disable_2fa_title') : t('set_up_2fa_title')}
          </Text>
        }
        radius="md"
        centered
        size="md"
      >
        {errorMessage && (
          <Alert icon={<IconAlertTriangle size={16} />} color="red" radius="md" mb="md">
            {errorMessage}
          </Alert>
        )}

        {/* STEP METHOD */}
        {setupStep === 'method' && (
          <Stack gap="md">
            <Text size="sm">
              {t('choose_auth_method')}
            </Text>

            <SegmentedControl
              value={twoFactorMethod}
              onChange={(val: any) => setTwoFactorMethod(val)}
              data={[
                { label: t('google_authenticator_totp'), value: 'totp' },
                { label: t('email_otp'), value: 'email' },
              ]}
              fullWidth
            />

            <PasswordInput
              label={t('confirm_your_password')}
              placeholder={t('enter_account_password')}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => setIsModalOpen(false)}>
                {t('cancel')}
              </Button>
              <Button 
                color="blue" 
                loading={actionLoading}
                onClick={twoFactorMethod === 'totp' ? handleStartTOTPSetup : handleStartEmailOTPSetup}
              >
                {t('continue')}
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP TOTP (Google Authenticator) */}
        {setupStep === 'totp' && (
          <Stack gap="md" align="center">
            <Text size="sm" ta="center">
              {t('scan_qr_code', { app: t('google_authenticator') })}
            </Text>

            {qrCodeUrl && (
              <Paper p="xs" withBorder radius="md" bg="white">
                <img src={qrCodeUrl} alt="Google Authenticator QR Code" style={{ width: 180, height: 180, display: 'block' }} />
              </Paper>
            )}

            {totpSecret && (
              <Group gap="xs" justify="center">
                <Text size="xs" c="dimmed">{t('secret_key')}</Text>
                <Text size="xs" fw={700} style={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                  {totpSecret}
                </Text>
                <CopyButton value={totpSecret}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? t('copied') : t('copy_key')}>
                      <ActionIcon size="sm" variant="subtle" color={copied ? 'teal' : 'gray'} onClick={copy}>
                        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            )}

            <TextInput
              label={t('enter_6digit_code')}
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.currentTarget.value)}
              maxLength={6}
              style={{ width: '100%' }}
              required
            />

            <Group justify="flex-end" style={{ width: '100%' }} mt="xs">
              <Button variant="default" onClick={() => setIsModalOpen(false)}>
                {t('cancel')}
              </Button>
              <Button color="blue" loading={actionLoading} onClick={handleVerifyTOTP}>
                {t('verify_activate')}
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP EMAIL OTP */}
        {setupStep === 'email' && (
          <Stack gap="md">
            <Text size="sm">
              {t('verification_code_sent')}
            </Text>

            <TextInput
              label={t('enter_6digit_email_code')}
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.currentTarget.value)}
              maxLength={6}
              required
            />

            <Group justify="space-between" mt="xs">
              <Button variant="subtle" size="xs" onClick={handleStartEmailOTPSetup} loading={actionLoading}>
                {t('resend_email_code')}
              </Button>
              <Group gap="xs">
                <Button variant="default" onClick={() => setIsModalOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button color="blue" loading={actionLoading} onClick={handleVerifyEmailOTP}>
                  {t('verify_activate')}
                </Button>
              </Group>
            </Group>
          </Stack>
        )}

        {/* STEP BACKUP CODES */}
        {setupStep === 'backup' && (
          <Stack gap="md">
            <Text size="sm">
              {t('save_backup_codes')}
            </Text>

            <Paper p="md" withBorder bg="gray.0" radius="md">
              <Stack gap="xs">
                {backupCodes.map((code, idx) => (
                  <Text key={idx} size="sm" fw={600} style={{ fontFamily: 'monospace' }}>
                    {code}
                  </Text>
                ))}
              </Stack>
            </Paper>

            <Group justify="flex-end" mt="xs">
              <CopyButton value={backupCodes.join('\n')}>
                {({ copied, copy }) => (
                  <Button
                    variant="light"
                    color={copied ? 'teal' : 'gray'}
                    leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    onClick={copy}
                  >
                    {copied ? t('copied_exclamation') : t('copy_all_codes')}
                  </Button>
                )}
              </CopyButton>
              <Button color="blue" onClick={() => { setIsModalOpen(false); refetch?.(); }}>
                {t('done')}
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP DISABLE */}
        {setupStep === 'disable' && (
          <Stack gap="md">
            <Text size="sm">
              {t('disable_2fa_confirm')}
            </Text>

            <PasswordInput
              label={t('confirm_your_password')}
              placeholder={t('enter_account_password')}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Group justify="flex-end" mt="xs">
              <Button variant="default" onClick={() => setIsModalOpen(false)}>
                {t('cancel')}
              </Button>
              <Button color="red" loading={actionLoading} onClick={handleDisable2FA}>
                {t('disable_2fa')}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  )
}