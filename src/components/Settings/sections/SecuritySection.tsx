import { useState, useEffect } from 'react'
import {
  Card,
  Stack,
  Divider,
  Group,
  Text,
  Switch,
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
import { 
  IconDeviceLaptop, 
  IconDeviceDesktop, 
  IconDeviceMobile,
  IconShieldCheck,
  IconQrcode,
  IconMail,
  IconKey,
  IconCopy,
  IconCheck,
  IconAlertTriangle,
  IconLock
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { SectionHeader } from '../components/SectionHeader'
import { api } from '#/lib/api'
import { useSession, twoFactor } from '#/lib/auth-client'

interface Session {
  id: string
  device: string
  location: string
  ipAddress: string | null
  createdAt: string
  current: boolean
}

export function SecuritySection() {
  const { data: sessionData, refetch } = useSession()
  const is2FAEnabled = Boolean(sessionData?.user?.twoFactorEnabled)

  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)

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

  // Révoquer une session
  const revokeSession = async (sessionId: string) => {
    setRevoking(sessionId)
    try {
      await api.delete(`/user/sessions/${sessionId}`)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      notifications.show({
        title: 'Session révoquée',
        message: 'La session a été révoquée avec succès',
        color: 'green'
      })
    } catch (error) {
      console.error('Failed to revoke session:', error)
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de révoquer la session',
        color: 'red'
      })
    } finally {
      setRevoking(null)
    }
  }

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
      setErrorMessage('Veuillez entrer votre mot de passe pour continuer')
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.enable({ password })
      if (res.error) {
        setErrorMessage(res.error.message || 'Mot de passe incorrect ou erreur')
        return
      }

      if (res.data) {
        setTotpURI(res.data.totpURI || '')
        setTotpSecret(res.data.totpURI?.split('secret=')[1]?.split('&')[0] || '')
        setBackupCodes(res.data.backupCodes || [])
      }
      setSetupStep('totp')
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible de générer le QR Code TOTP')
    } finally {
      setActionLoading(false)
    }
  }

  // Démarrer la configuration Email OTP
  const handleStartEmailOTPSetup = async () => {
    if (!password) {
      setErrorMessage('Veuillez entrer votre mot de passe pour continuer')
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const enableRes = await twoFactor.enable({ password })
      if (enableRes.error) {
        setErrorMessage(enableRes.error.message || 'Mot de passe incorrect')
        return
      }

      const sendRes = await twoFactor.sendOtp()
      if (sendRes.error) {
        setErrorMessage(sendRes.error.message || "Impossible d'envoyer l'email OTP")
        return
      }

      notifications.show({
        title: 'Code envoyé',
        message: 'Un code de vérification à 6 chiffres a été envoyé par email',
        color: 'blue'
      })
      setSetupStep('email')
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'envoi de l'OTP")
    } finally {
      setActionLoading(false)
    }
  }

  // Vérifier et activer TOTP
  const handleVerifyTOTP = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setErrorMessage('Veuillez entrer le code à 6 chiffres de votre application d\'authentification')
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.verifyTotp({ code: verificationCode })
      if (res.error) {
        setErrorMessage(res.error.message || 'Code invalide')
        return
      }

      notifications.show({
        title: '2FA Activé !',
        message: 'L\'authentification Google Authenticator est maintenant activée',
        color: 'green'
      })
      if (backupCodes.length > 0) {
        setSetupStep('backup')
      } else {
        setIsModalOpen(false)
        refetch?.()
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec de vérification du code TOTP')
    } finally {
      setActionLoading(false)
    }
  }

  // Vérifier et activer Email OTP
  const handleVerifyEmailOTP = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setErrorMessage('Veuillez entrer le code à 6 chiffres reçu par email')
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.verifyOtp({ code: verificationCode })
      if (res.error) {
        setErrorMessage(res.error.message || 'Code email invalide')
        return
      }

      notifications.show({
        title: '2FA Activé !',
        message: 'L\'authentification 2FA par email est activée avec succès',
        color: 'green'
      })
      setIsModalOpen(false)
      refetch?.()
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec de vérification du code Email OTP')
    } finally {
      setActionLoading(false)
    }
  }

  // Désactiver la 2FA
  const handleDisable2FA = async () => {
    if (!password) {
      setErrorMessage('Veuillez entrer votre mot de passe pour confirmer la désactivation')
      return
    }
    setActionLoading(true)
    setErrorMessage(null)

    try {
      const res = await twoFactor.disable({ password })
      if (res.error) {
        setErrorMessage(res.error.message || 'Mot de passe incorrect')
        return
      }

      notifications.show({
        title: '2FA Désactivé',
        message: 'L\'authentification à deux facteurs a été désactivée',
        color: 'gray'
      })
      setIsModalOpen(false)
      refetch?.()
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible de désactiver la 2FA')
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
          title="Two-Factor Authentication (2FA)" 
          description="Add an extra layer of security to your account using Google Authenticator or Email OTP."
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
                  {is2FAEnabled ? 'Two-Factor Authentication is Enabled' : 'Two-Factor Authentication is Disabled'}
                </Text>
                <Badge color={is2FAEnabled ? 'green' : 'gray'} variant="light" size="sm">
                  {is2FAEnabled ? 'Active' : 'Off'}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {is2FAEnabled 
                  ? 'Your account is protected with 2FA code verification on login.' 
                  : 'Protect your account from unauthorized access by requiring a verification code upon login.'}
              </Text>
            </div>
          </Group>

          {is2FAEnabled ? (
            <Button variant="outline" color="red" size="xs" onClick={handleOpenDisableModal}>
              Disable 2FA
            </Button>
          ) : (
            <Button color="blue" size="xs" onClick={handleOpenEnableModal}>
              Enable 2FA
            </Button>
          )}
        </Group>
      </Card>

      <Card withBorder radius="md" p="lg" bg="white">
        <SectionHeader title="Active Sessions" description="Manage devices currently signed into your account." />
        <Divider my="md" />
        
        {loadingSessions ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading sessions...</Text>
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
                    This device
                  </Badge>
                ) : (
                  null
                )}
              </Group>
            ))}
            {sessions.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" py="md">
                Aucune session active trouvée
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
            {setupStep === 'disable' ? 'Disable 2FA' : 'Set Up Two-Factor Authentication'}
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
              Choose your preferred authentication method and enter your current password to continue.
            </Text>

            <SegmentedControl
              value={twoFactorMethod}
              onChange={(val: any) => setTwoFactorMethod(val)}
              data={[
                { label: 'Google Authenticator (TOTP)', value: 'totp' },
                { label: 'Email OTP', value: 'email' },
              ]}
              fullWidth
            />

            <PasswordInput
              label="Confirm your password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                color="blue" 
                loading={actionLoading}
                onClick={twoFactorMethod === 'totp' ? handleStartTOTPSetup : handleStartEmailOTPSetup}
              >
                Continue
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP TOTP (Google Authenticator) */}
        {setupStep === 'totp' && (
          <Stack gap="md" align="center">
            <Text size="sm" ta="center">
              Scan this QR code with <strong>Google Authenticator</strong> or your preferred 2FA app (Authy, 1Password).
            </Text>

            {qrCodeUrl && (
              <Paper p="xs" withBorder radius="md" bg="white">
                <img src={qrCodeUrl} alt="Google Authenticator QR Code" style={{ width: 180, height: 180, display: 'block' }} />
              </Paper>
            )}

            {totpSecret && (
              <Group gap="xs" justify="center">
                <Text size="xs" c="dimmed">Secret key:</Text>
                <Text size="xs" fw={700} style={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                  {totpSecret}
                </Text>
                <CopyButton value={totpSecret}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy key'}>
                      <ActionIcon size="sm" variant="subtle" color={copied ? 'teal' : 'gray'} onClick={copy}>
                        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            )}

            <TextInput
              label="Enter 6-digit code"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.currentTarget.value)}
              maxLength={6}
              style={{ width: '100%' }}
              required
            />

            <Group justify="flex-end" style={{ width: '100%' }} mt="xs">
              <Button variant="default" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button color="blue" loading={actionLoading} onClick={handleVerifyTOTP}>
                Verify & Activate
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP EMAIL OTP */}
        {setupStep === 'email' && (
          <Stack gap="md">
            <Text size="sm">
              We have sent a 6-digit verification code to your email. Enter it below to activate 2FA.
            </Text>

            <TextInput
              label="Enter 6-digit Email code"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.currentTarget.value)}
              maxLength={6}
              required
            />

            <Group justify="space-between" mt="xs">
              <Button variant="subtle" size="xs" onClick={handleStartEmailOTPSetup} loading={actionLoading}>
                Resend email code
              </Button>
              <Group gap="xs">
                <Button variant="default" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button color="blue" loading={actionLoading} onClick={handleVerifyEmailOTP}>
                  Verify & Activate
                </Button>
              </Group>
            </Group>
          </Stack>
        )}

        {/* STEP BACKUP CODES */}
        {setupStep === 'backup' && (
          <Stack gap="md">
            <Text size="sm">
              Save your recovery backup codes. If you lose access to your authenticator app, these codes will allow you to sign in.
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
                    {copied ? 'Copied!' : 'Copy all codes'}
                  </Button>
                )}
              </CopyButton>
              <Button color="blue" onClick={() => { setIsModalOpen(false); refetch?.(); }}>
                Done
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP DISABLE */}
        {setupStep === 'disable' && (
          <Stack gap="md">
            <Text size="sm">
              Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.
            </Text>

            <PasswordInput
              label="Confirm your password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Group justify="flex-end" mt="xs">
              <Button variant="default" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" loading={actionLoading} onClick={handleDisable2FA}>
                Disable 2FA
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  )
}
