import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconLogout, IconSettings, IconUser } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface UserMenuProps {
  name: string
  role: string
  avatarUrl?: string
  onLogout?: () => void
}

export function UserMenu({ name, role, avatarUrl, onLogout }: UserMenuProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Menu shadow="md" width={200} position="bottom-end" withArrow>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs" wrap="nowrap">
            <Avatar src={avatarUrl} radius="xl" size={28} color="blue">
              {name.charAt(0)}
            </Avatar>
            <div style={{ lineHeight: 1.1 }}>
              <Text size="xs" fw={600}>
                {name}
              </Text>
              <Text size="xs" c="dimmed">
                {role}
              </Text>
            </div>
            <IconChevronDown size={14} color="var(--mantine-color-gray-6)" />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item 
          leftSection={<IconUser size={14} />}
          onClick={() => navigate({ to: '/dashboard/settings' })}
        >
          {t('profile')}
        </Menu.Item>
        <Menu.Item 
          leftSection={<IconSettings size={14} />}
          onClick={() => navigate({ to: '/dashboard/settings' })}
        >
          {t('settings')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={onLogout}>
          {t('log_out')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}