import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface NewCampaignButtonProps {
  onCreate?: () => void
}

export function NewCampaignButton({ onCreate }: NewCampaignButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleClick = () => {
    if (onCreate) {
      onCreate()
    } else {
      navigate({ to: '/dashboard/mails/new' })
    }
  }

  return (
    <Button.Group>
      <Button
        leftSection={<IconPlus size={16} />}
        color="blue"
        radius="sm"
        onClick={handleClick}
      >
        {t('new_mail')}
      </Button>
    </Button.Group>
  )
}