import { Group, Paper, Stack, Text, UnstyledButton, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { 
  IconCirclePlus,
  IconPlugConnected,
  IconTemplate,
  IconHistory,
  IconChevronRight
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

interface QuickAction {
  key: string
  label: string
  icon: React.ElementType
  href: string
  tooltip?: string
  priority?: 'primary' | 'secondary'
}

const quickActions: QuickAction[] = [
  { 
    key: 'create-mail', 
    label: 'create_mail', 
    icon: IconCirclePlus,
    href: '/dashboard/mails/new',
    tooltip: 'compose_send_new_email',
    priority: 'primary'
  },
  { 
    key: 'templates', 
    label: 'templates', 
    icon: IconTemplate,
    href: '/dashboard/templates',
    tooltip: 'manage_email_templates',
    priority: 'secondary'
  },
  { 
    key: 'email-history', 
    label: 'email_history', 
    icon: IconHistory,
    href: '/dashboard/mails',
    tooltip: 'view_sent_scheduled_emails',
    priority: 'secondary'
  },
  { 
    key: 'connect-mailbox', 
    label: 'connect_mailbox', 
    icon: IconPlugConnected,
    href: '/dashboard/settings?section=mailboxes',
    tooltip: 'add_manage_mailbox',
    priority: 'primary'
  },
]
 
interface QuickActionsCardProps {
  onAction?: (key: string) => void
}

export function QuickActionsCard({ onAction }: QuickActionsCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleAction = (action: QuickAction) => {
    // Callback pour compatibilité
    onAction?.(action.key)
    
    // Navigation directe
    navigate({ to: action.href })
  }

  return (
    <Paper withBorder radius="sm" p="sm">
      <Text size="sm" fw={600} mb="sm">
        {t('quick_actions')}
      </Text>

      <Stack gap={4}>
        {quickActions.map((action) => (
          <Tooltip
            key={action.key}
            label={t(action.tooltip || '')}
            position="right"
            withArrow
            disabled={!action.tooltip}
          >
            <UnstyledButton
              onClick={() => handleAction(action)}
              className={`
                group
                rounded-md
                px-3
                py-2.5
                transition-all
                duration-200
                hover:bg-gray-100
                hover:translate-x-1
                active:scale-[0.98]
                w-full
                ${action.priority === 'primary' ? 'hover:bg-blue-50' : ''}
              `}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap={10}>
                  <div
                    className="
                      transition-transform
                      duration-200
                      group-hover:scale-110
                      group-hover:rotate-6
                    "
                  >
                    <action.icon
                      size={16}
                      color={action.priority === 'primary' 
                        ? 'var(--mantine-color-blue-6)' 
                        : 'var(--mantine-color-gray-6)'
                      }
                    />
                  </div>

                  <Text
                    size="sm"
                    c={action.priority === 'primary' ? 'blue' : 'dark.6'}
                    className="
                      transition-colors
                      duration-200
                      group-hover:text-black
                      group-hover:font-medium
                    "
                  >
                    {t(action.label)}
                  </Text>
                </Group>

                <IconChevronRight
                  size={12}
                  color="var(--mantine-color-gray-5)"
                  className="
                    opacity-0
                    transition-all
                    duration-200
                    group-hover:opacity-100
                    group-hover:translate-x-1
                  "
                />
              </Group>
            </UnstyledButton>
          </Tooltip>
        ))}
      </Stack>
    </Paper>
  )
}