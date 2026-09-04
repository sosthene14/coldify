import { Menu, UnstyledButton, Group, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { IconLanguage, IconCheck } from '@tabler/icons-react'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
  }

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <UnstyledButton
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db'
            e.currentTarget.style.backgroundColor = '#f9fafb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.backgroundColor = 'white'
          }}
        >
          <Group gap={8}>
            <IconLanguage size={18} color="#6b7280" />
            <Text size="sm" fw={500} c="gray.7">
              {currentLanguage.flag} {currentLanguage.label}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            leftSection={
              <Text size="lg" style={{ marginRight: 4 }}>
                {language.flag}
              </Text>
            }
            rightSection={
              i18n.language === language.code ? (
                <IconCheck size={16} color="#10b981" />
              ) : null
            }
            style={{
              backgroundColor: i18n.language === language.code ? '#f0fdf4' : undefined,
            }}
          >
            <Text size="sm" fw={i18n.language === language.code ? 600 : 400}>
              {language.label}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
