import { useState, useEffect } from 'react'
import { Box, Stack, Text, Group, UnstyledButton } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useSearch } from '@tanstack/react-router'
import { Sidebar } from './components/Sidebar'
import { ProfileSection } from './sections/ProfileSection'
import { MailboxesSection } from './sections/MailboxesSection'
import { NotificationsSection } from './sections/NotificationsSection'
import { SecuritySection } from './sections/SecuritySection'
import { AppSection } from './sections/AppSection'
import { SubscriptionSection } from './sections/SubscriptionSection'
import type { Section } from './types'
import { 
  IconUser,
  IconMail,
  IconBell,
  IconLock,
  IconDeviceMobile
} from '@tabler/icons-react'

const navItems: { section: Section; label: string; icon: any }[] = [
  { section: 'profile', label: 'profile_account', icon: IconUser },
  { section: 'mailboxes', label: 'mailboxes', icon: IconMail },
  // { section: 'subscription', label: 'subscription', icon: IconCreditCard },
  { section: 'notifications', label: 'notifications', icon: IconBell },
  { section: 'security', label: 'security', icon: IconLock },
  { section: 'app', label: 'app_pwa', icon: IconDeviceMobile },
]

const SETTINGS_SECTION_STORAGE_KEY = 'settings-active-section'
const validSections: Section[] = ['profile', 'mailboxes', 'subscription', 'notifications', 'security', 'app']

export function SettingsPage() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/dashboard/settings/' })
  const [active, setActive] = useState<Section>(() => {
    if (search.section && validSections.includes(search.section)) {
      return search.section
    }

    if (typeof window !== 'undefined') {
      const storedSection = window.localStorage.getItem(SETTINGS_SECTION_STORAGE_KEY)
      if (storedSection && validSections.includes(storedSection as Section)) {
        return storedSection as Section
      }
    }

    return 'profile'
  })

  // Set initial section from URL search params
  useEffect(() => {
    if (search.section && validSections.includes(search.section)) {
      setActive(search.section)
    }
  }, [search.section])

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_SECTION_STORAGE_KEY, active)
  }, [active])

  return (
    <div className="min-h-screen mx-2 md:mx-6">
      <Stack gap="md" mx={{ base: 'xs', sm: 'sm', md: 'lg' }} py={{ base: 'xs', sm: 'sm', md: 'md' }}>
        <Text size="xl" fw={700}>
          {t('settings')}
        </Text>

        <Box className="settings-mobile-nav" data-onboarding="settings-mobile-section" hiddenFrom="sm">
          <Group gap="xs" wrap="nowrap">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.section

              return (
                <UnstyledButton
                  key={item.section}
                  data-onboarding={`settings-mobile-${item.section}`}
                  onClick={() => setActive(item.section)}
                  className={`settings-mobile-nav-item${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <Text size="xs" fw={isActive ? 700 : 500} lh={1.1}>
                    {t(item.label)}
                  </Text>
                </UnstyledButton>
              )
            })}
          </Group>
        </Box>

        <Group align="flex-start" gap="md" wrap="nowrap">
          <Sidebar active={active} onSectionChange={setActive} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack gap="md">
              {active === 'profile' && <ProfileSection />}
              {active === 'mailboxes' && <MailboxesSection />}
              {active === 'subscription' && <SubscriptionSection />}
              {active === 'notifications' && <NotificationsSection />}
              {active === 'security' && <SecuritySection />}
              {active === 'app' && <AppSection />}
            </Stack>
          </div>
        </Group>
      </Stack>
    </div>
  )
}