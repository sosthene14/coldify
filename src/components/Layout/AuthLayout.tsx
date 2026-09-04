import type { ReactNode } from 'react'
import { Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen max-h-screen bg-white overflow-hidden">
      {/* Image gauche */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
        <img
          src="/auth-cover.jfif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <Text size="xl" fw={600}>
            {t('so_mails')}
          </Text>
          <Text size="sm" c="gray.3" mt={4}>
            {t('manage_everything')}
          </Text>
        </div>
      </div>

      {/* Formulaire droite */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 relative overflow-y-auto">
        {/* Language Switcher - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md my-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/logo.png" 
              alt="So-mails" 
              className="h-12 w-auto"
            />
          </div>

          <Stack gap={4} mb="lg">
            <Text size="xl" fw={600} c="dark.7">
              {title}
            </Text>
            <Text size="sm" c="dimmed">
              {subtitle}
            </Text>
          </Stack>

          {children}
        </div>
      </div>
    </div>
  )
}