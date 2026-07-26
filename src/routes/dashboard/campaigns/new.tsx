import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CreateCampaign } from '#/components/Campaigns'
import type { CampaignFormData } from '#/components/Campaigns'

export const Route = createFileRoute('/dashboard/campaigns/new')({
  component: NewCampaignPage,
})

function NewCampaignPage() {
  const navigate = useNavigate()

  const handleSubmit = (data: CampaignFormData) => {
    console.log('Campaign data submitted:', data)
    // TODO: API call to create campaign
    // navigate({ to: '/campaigns' })
    alert('Campaign created successfully!')
  }

  const handleCancel = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <CreateCampaign 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
