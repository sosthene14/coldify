import { CampaignDetailPage } from '#/components/Campaigns/CampaignDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/campaigns/$campaignId')({
  component: CampaignDetailPage,
})

