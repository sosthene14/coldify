import { Group, Burger, Drawer, Stack, Menu, ActionIcon, Divider, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { IconLanguage, IconLayoutDashboard, IconMail, IconTemplate, IconSettings, IconChevronRight } from '@tabler/icons-react'
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

const navIcons = {
  overview: IconLayoutDashboard,
  emails: IconMail,
  templates: IconTemplate,
  settings: IconSettings,
}

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
        <Group  wrap="nowrap">
          <SearchBar />

          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                data-onboarding="language-selector"
                variant="subtle"
                color="gray"
                size="lg"
              >
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
        size="82%"
        padding="md"
        title={<Text fw={700} size="lg">{t('navigate')}</Text>}
        hiddenFrom="sm"
        zIndex={1000000}
        position="right"
        overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
      >
        <Stack gap="lg">
          {/* Mobile Navigation Links */}
          <Stack gap={6}>
            {navItems?.map((item) => (
              (() => {
                const Icon = navIcons[item.label as keyof typeof navIcons] || IconChevronRight
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={classes.mainLink}
                    activeProps={{ 'data-active': true }}
                    activeOptions={{ exact: true }}
                    onClick={closeDrawer}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      minHeight: 52,
                      padding: '12px 14px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                    }}
                  >
                    <Group gap="sm" wrap="nowrap">
                      <Icon size={19} stroke={1.8} />
                      <span>{t(item.label)}</span>
                    </Group>
                    <IconChevronRight size={17} stroke={1.8} />
                  </Link>
                )
              })()
            ))}
          </Stack>

          {/* Mobile language switcher */}
          <>
            <Divider />
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">
              {t('interface_language')}
            </Text>
            <Stack gap={6}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  handleChangeLanguage(lang.code)
                  closeDrawer()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left',
                  width: '100%',
                  minHeight: 46,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: i18n.language === lang.code ? '1px solid var(--mantine-color-blue-3)' : '1px solid transparent',
                  background: i18n.language === lang.code ? 'var(--mantine-color-blue-0)' : 'transparent',
                  fontSize: '14px',
                  fontWeight: i18n.language === lang.code ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {lang.label}
              </button>
            ))}
            </Stack>
          </>
        </Stack>
      </Drawer>
    </>
  )
}