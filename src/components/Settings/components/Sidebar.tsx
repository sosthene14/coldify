import { Card, Stack, UnstyledButton, Group, Text } from '@mantine/core'
import {
  IconUser,
  IconMail,
  IconBell,
  IconLock,
  IconDeviceMobile,
} from '@tabler/icons-react'
import type { Section, NavItem } from '../types'

const navItems: NavItem[] = [
  { section: 'profile', label: 'Profile & Account', icon: IconUser },
  { section: 'mailboxes', label: 'Mailboxes', icon: IconMail },
  { section: 'notifications', label: 'Notifications', icon: IconBell },
  { section: 'security', label: 'Security', icon: IconLock },
  { section: 'app', label: 'App & PWA', icon: IconDeviceMobile },
  
]

interface SidebarProps {
  active: Section
  onSectionChange: (section: Section) => void
}

export function Sidebar({ active, onSectionChange }: SidebarProps) {
  return (
    <Card
      withBorder
      radius="md"
      p="sm"
      bg="white"
      style={{ width: 240, flexShrink: 0 }}
      visibleFrom="sm"
    >
      <Stack gap={2}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.section

          return (
            <UnstyledButton
              key={item.section}
              onClick={() => onSectionChange(item.section)}
              py={8}
              px={10}
              style={{
                borderRadius: 6,
                backgroundColor: isActive ? '#EDF2FF' : 'transparent',
              }}
            >
              <Group gap={8} wrap="nowrap">
                <Icon size={16} color={isActive ? '#4C6EF5' : '#868E96'} />
                <Text
                  size="sm"
                  fw={isActive ? 600 : 400}
                  c={isActive ? 'dark.9' : 'dark.7'}
                >
                  {item.label}
                </Text>
              </Group>
            </UnstyledButton>
          )
        })}
      </Stack>
    </Card>
  )
}
