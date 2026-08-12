import { Group, Burger, Drawer, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Logo } from './Logo'
import { NavLinks } from './NavLinks'
import { NotificationBell } from './NotificationBell'
import { SearchBar } from './SearchBar'
import { UserMenu } from './UserMenu'
import { Link } from '@tanstack/react-router'
import { navItems } from '#/configs/nav.config.ts'
import classes from './navLinks.module.css'

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
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

  return (
    <>
      <Group
        h={54}
        px={{ base: 'sm', sm: 'md', md: 'lg' }}
        justify="space-between"
        wrap="nowrap"
        className='border border-gray-200'
      >
        {/* Left side - Logo + Nav (desktop) */}
        <Group gap={{ base: 8, sm: 20, md: 40 }} wrap="nowrap">
          <Logo />
          <NavLinks />
        </Group>

        {/* Right side - Search + User Menu (desktop) + Burger (mobile) */}
        <Group gap={{ base: 4, sm: 8, md: 'md' }} wrap="nowrap">
          <SearchBar />
          <UserMenu name={user.name} role={user.role} avatarUrl={user.avatarUrl} onLogout={onLogout} />
          
          {/* Burger menu for mobile */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            size="sm"
          />
        </Group>
      </Group>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="75%"
        padding="sm"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
        position="right"
      >
        <Stack gap="4">
          {/* Mobile Navigation Links */}
          <Stack gap="2">
            {navItems?.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={classes.mainLink}
                activeProps={{ 'data-active': true }}
                activeOptions={{ exact: true }}
                onClick={closeDrawer}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  )
}