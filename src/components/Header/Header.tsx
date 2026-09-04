import { Group, Burger, Drawer, Stack, Menu, ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { IconLanguage } from '@tabler/icons-react'
import { Logo } from './Logo'
import { NavLinks } from './NavLinks'
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

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

export function Header({ user,  onLogout }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code)
  }

  return (
    <>
      <Group
        h={54}
        px={{ base: 'xs', sm: 'md', md: 'lg' }}
        justify="space-between"
        wrap="nowrap"
        gap="xs"
        className='border border-gray-200'
      >
        {/* Left side - Logo + Nav (desktop) */}
        <Group  wrap="nowrap">
          <Logo />
          <NavLinks />
        </Group>

        {/* Right side - Search + User Menu (desktop) + Burger (mobile) */}
        <Group g wrap="nowrap">
          <SearchBar />

          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" size="lg">
                <IconLanguage size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {languages.map((lang) => (
                <Menu.Item
                  key={lang.code}
                  onClick={() => handleChangeLanguage(lang.code)}
                  fw={i18n.language === lang.code ? 700 : 400}
                >
                  {lang.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

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
        title={t('navigate')}
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
                {t(item.label)}
              </Link>
            ))}
          </Stack>

          {/* Mobile language switcher */}
          <Stack gap="2" mt="md">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  handleChangeLanguage(lang.code)
                  closeDrawer()
                }}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: i18n.language === lang.code ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {lang.label}
              </button>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  )
}