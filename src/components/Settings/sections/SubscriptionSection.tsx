import { useEffect, useState } from 'react'
import {
  Card,
  Stack,
  Text,
  Badge,
  Group,
  Divider,
  Button,
  Loader,
  Alert,
  Table,
} from '@mantine/core'
import {
  IconCheck,
  IconX,
  IconCreditCard,
  IconInfoCircle,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionStore } from '../../../stores/subscription.store'
import { subscriptionService } from '../../../services/subscription.service'
import { SectionHeader } from '../components/SectionHeader'

// Declare Paddle global type
declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: 'sandbox' | 'production') => void
      }
      Initialize: (config: { token: string }) => void
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>
          customer?: { email: string }
          customData?: { organization_id: string }
        }) => void
      }
    }
  }
}

export function SubscriptionSection() {
  const { t } = useTranslation()
  const { stats, plans, loading, error, fetchStats, fetchPlans } = useSubscriptionStore()
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [paddleReady, setPaddleReady] = useState(false)
  const [paddleConfig, setPaddleConfig] = useState<any>(null)

  useEffect(() => {
    fetchStats()
    fetchPlans()
    loadPaddleConfig()
  }, [])

  const loadPaddleConfig = async () => {
    try {
      const config = await subscriptionService.getPaddleConfig()
      setPaddleConfig(config)
      
      // Load Paddle.js script
      if (!document.querySelector('script[src*="paddle.js"]')) {
        const script = document.createElement('script')
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
        script.onload = () => {
          if (window.Paddle) {
            window.Paddle.Environment.set(config.environment)
            window.Paddle.Initialize({ token: config.clientToken })
            setPaddleReady(true)
          }
        }
        document.head.appendChild(script)
      } else if (window.Paddle) {
        setPaddleReady(true)
      }
    } catch (err) {
      console.error('Failed to load Paddle config:', err)
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (!paddleReady || !window.Paddle || !paddleConfig) {
      alert(t('upgrade_failed'))
      return
    }

    try {
      setUpgrading(planId)
      
      const plan = paddleConfig.plans.find((p: any) => p.id === planId)
      console.log('Upgrading to plan:', planId, 'with priceId:', plan?.priceId)
      
      if (!plan || !plan.priceId) {
        alert(t('upgrade_failed'))
        return
      }

      window.Paddle.Checkout.open({
        items: [{ priceId: plan.priceId, quantity: 1 }],
        customer: { email: paddleConfig.customerEmail },
        customData: { organization_id: paddleConfig.organizationId },
      })
    } catch (err) {
      console.error('Failed to open Paddle checkout:', err)
      alert(t('upgrade_failed'))
    } finally {
      setUpgrading(null)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Group justify="center" py="xl">
          <Loader size="sm" />
        </Group>
      </Card>
    )
  }

  if (error || !stats || !stats.plan || !stats.providers) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Alert color="red" icon={<IconInfoCircle />}>
          {error || 'Unable to load subscription data. Please make sure the backend is running and migrations are applied.'}
        </Alert>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'trialing': return 'blue'
      case 'past_due': return 'yellow'
      case 'canceled': return 'red'
      default: return 'gray'
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const providerUsageText = stats.providers.max 
    ? `${stats.providers.current} / ${stats.providers.max}`
    : `${stats.providers.current} / ∞`

  const providerUsagePercent = stats.providers.max
    ? Math.round((stats.providers.current / stats.providers.max) * 100)
    : 0

  return (
    <Stack gap="md">
      {/* Current Plan */}
      <Card withBorder radius="md" p="lg" bg="white">
        <SectionHeader
          title={t('current_plan')}
          description={t('manage_subscription_billing')}
        />
        <Divider my="md" />
        
        <Group justify="space-between" mb="md">
          <div>
            <Group gap="xs" mb={4}>
              <IconCreditCard size={20} />
              <Text size="lg" fw={600}>
                {stats.plan.name} {t('plan')}
              </Text>
              <Badge color={getStatusColor(stats.status)} variant="light" size="sm">
                {stats.status}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {formatPrice(stats.plan.priceCents)}{t('per_month')}
            </Text>
          </div>
          
          {stats.plan.id !== 'unlimited' && (
            <Button 
              variant="light" 
              color="blue" 
              radius="sm"
              loading={upgrading !== null}
              onClick={() => {
                const nextPlan = stats.plan.id === 'free' ? 'pro' : 'unlimited'
                handleUpgrade(nextPlan)
              }}
            >
              {t('upgrade_plan')}
            </Button>
          )}
        </Group>

        {stats.currentPeriodEnd && (
          <Text size="sm" c="dimmed">
            {t('renews_on')} {new Date(stats.currentPeriodEnd).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        )}
      </Card>

      {/* Usage & Limits */}
      <Card withBorder radius="md" p="lg" bg="white">
        <SectionHeader
          title={t('usage_limits')}
          description={t('track_current_usage')}
        />
        <Divider my="md" />
        
        <Table horizontalSpacing="md" verticalSpacing="sm">
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Text size="sm" fw={500}>{t('emails_per_day_label')}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {stats.plan.emailsPerDay ?? t('unlimited')}
                </Text>
              </Table.Td>
            </Table.Tr>
            
            <Table.Tr>
              <Table.Td>
                <Text size="sm" fw={500}>{t('connected_providers_count')}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Text size="sm" fw={600}>
                    {providerUsageText}
                  </Text>
                  {stats.providers.max && providerUsagePercent >= 100 && (
                    <Badge color="red" variant="light" size="xs">
                      {t('limit_reached')}
                    </Badge>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
            
            <Table.Tr>
              <Table.Td>
                <Text size="sm" fw={500}>{t('history_retention')}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {stats.plan.historyDays ? `${stats.plan.historyDays} ${t('days_history')}` : t('unlimited')}
                </Text>
              </Table.Td>
            </Table.Tr>
            
            <Table.Tr>
              <Table.Td>
                <Text size="sm" fw={500}>{t('priority_support')}</Text>
              </Table.Td>
              <Table.Td>
                {stats.features.prioritySupport ? (
                  <Badge color="green" variant="light" size="sm" leftSection={<IconCheck size={12} />}>
                    {t('included')}
                  </Badge>
                ) : (
                  <Badge color="gray" variant="light" size="sm" leftSection={<IconX size={12} />}>
                    {t('not_available')}
                  </Badge>
                )}
              </Table.Td>
            </Table.Tr>
            
            <Table.Tr>
              <Table.Td>
                <Text size="sm" fw={500}>{t('integration_api')}</Text>
              </Table.Td>
              <Table.Td>
                {stats.features.integrationApi ? (
                  <Badge color="green" variant="light" size="sm" leftSection={<IconCheck size={12} />}>
                    {t('included')}
                  </Badge>
                ) : (
                  <Badge color="gray" variant="light" size="sm" leftSection={<IconX size={12} />}>
                    {t('not_available')}
                  </Badge>
                )}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        {!stats.providers.canAdd && stats.providers.max && (
          <Alert color="yellow" icon={<IconInfoCircle />} mt="md">
            <Text size="sm">
              {t('provider_limit_reached_message')}
            </Text>
          </Alert>
        )}
      </Card>

      {/* Available Plans */}
      {plans && plans.length > 1 && (
        <Card withBorder radius="md" p="lg" bg="white" mb="lg">
          <SectionHeader
            title={t('available_plans')}
            description={t('compare_plans_upgrade')}
          />
          <Divider my="md" />
          
          <Stack gap="sm">
            {plans
              .filter((plan) => plan.id !== stats.plan.id)
              .map((plan) => (
                <Card key={plan.id} withBorder p="md" radius="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <div style={{ flex: 1 }}>
                      <Group gap="xs" mb={4}>
                        <Text size="md" fw={600}>{plan.name}</Text>
                        <Text size="lg" fw={700} c="blue">
                          {formatPrice(plan.priceCents)}
                          <Text span size="sm" c="dimmed">{t('per_month')}</Text>
                        </Text>
                      </Group>
                      
                      <Text size="xs" c="dimmed">
                        {plan.emailsPerDay ?? '∞'} emails/day · {' '}
                        {plan.maxConnectedProviders ?? '∞'} providers · {' '}
                        {plan.historyDays ?? '∞'} {t('days_history')}
                        {plan.hasPrioritySupport && ` · ${t('priority_support')}`}
                        {plan.hasIntegrationApi && ` · ${t('integration_api')}`}
                      </Text>
                    </div>
                    
                    <Button 
                      variant="light" 
                      radius="sm" 
                      size="sm"
                      loading={upgrading === plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {t('upgrade')}
                    </Button>
                  </Group>
                </Card>
              ))}
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
