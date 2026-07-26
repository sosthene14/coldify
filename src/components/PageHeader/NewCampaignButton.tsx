import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

interface NewCampaignButtonProps {
  onCreate?: () => void
}

export function NewCampaignButton({ onCreate }: NewCampaignButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onCreate) {
      onCreate()
    } else {
      navigate({ to: '/dashboard/campaigns/new' })
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
        New Campaign
      </Button>
    </Button.Group>
  )
}