import { useState, useEffect } from 'react'
import { Stack, Text, Group, Select } from '@mantine/core'
import { useSearch } from '@tanstack/react-router'
import { Sidebar } from './components/Sidebar'
import { ProfileSection } from './sections/ProfileSection'
import { MailboxesSection } from './sections/MailboxesSection'
import { NotificationsSection } from './sections/NotificationsSection'
import { SecuritySection } from './sections/SecuritySection'
import { AppSection } from './sections/AppSection'
import type { Section } from './types'
import { 
  IconUser,
  IconMail,
  IconBell,
  IconLock,
  IconDeviceMobile,
} from '@tabler/icons-react'

const navItems: { section: Section; label: string; icon: any }[] = [
  { section: 'profile', label: 'Profile & Account', icon: IconUser },
  { section: 'mailboxes', label: 'Mailboxes', icon: IconMail },
  { section: 'notifications', label: 'Notifications', icon: IconBell },
  { section: 'security', label: 'Security', icon: IconLock },
  { section: 'app', label: 'App & PWA', icon: IconDeviceMobile },
]

export function SettingsPage() {
  const search = useSearch({ from: '/dashboard/settings/' })
  const [active, setActive] = useState<Section>('profile')

  // Set initial section from URL search params
  useEffect(() => {
    if (search.section && ['profile', 'mailboxes', 'notifications', 'security', 'app'].includes(search.section)) {
      setActive(search.section as Section)
    }
  }, [search.section])

  return (
    <div className="min-h-screen">
      <Stack gap="md" mx={{ base: 'xs', sm: 'sm', md: 'lg' }} py={{ base: 'xs', sm: 'sm', md: 'md' }}>
        <Text size="xl" fw={700}>
          Settings
        </Text>

        {/* Mobile: Dropdown menu for navigation */}
        <Select
          hiddenFrom="sm"
          value={active}
          onChange={(value) => setActive(value as Section)}
          data={navItems.map(item => ({
            value: item.section,
            label: item.label
          }))}
          leftSection={(() => {
            const item = navItems.find(i => i.section === active)
            const Icon = item?.icon
            return Icon ? <Icon size={16} /> : null
          })()}
        />

        <Group align="flex-start" gap="md" wrap="nowrap">
          <Sidebar active={active} onSectionChange={setActive} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack gap="md">
              {active === 'profile' && <ProfileSection />}
              {active === 'mailboxes' && <MailboxesSection />}
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