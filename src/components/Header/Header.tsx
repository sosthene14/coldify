import { Group } from '@mantine/core'
import { Logo } from './Logo'
import { NavLinks } from './NavLinks'
import { NotificationBell } from './NotificationBell'
import { SearchBar } from './SearchBar'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  user: {
    name: string
    role: string
    avatarUrl?: string
  }
  notificationCount?: number
  onLogout?: () => void
}

export function Header({ user, notificationCount = 0, onLogout }: HeaderProps) {
  return (
    <Group
      h={54}
      px="lg"
      justify="space-between"
      wrap="nowrap"
      className='border border-gray-200'
    >
      <Group gap={40} wrap="nowrap">
        <Logo />
        <NavLinks />
      </Group>

      <Group gap="md" wrap="nowrap">
        <SearchBar />
        <NotificationBell count={notificationCount} />
        <UserMenu name={user.name} role={user.role} avatarUrl={user.avatarUrl} onLogout={onLogout} />
      </Group>
    </Group>
  )
}