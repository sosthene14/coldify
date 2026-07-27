import { createFileRoute } from '@tanstack/react-router'

import { CampaignsSkeleton } from '#/components/Campaigns/CampaignsSkeleton'
import { CampaignsPage } from '#/components/Campaigns/CampaignPage'

export const Route = createFileRoute('/dashboard/campaigns/')({
  component: CampaignsPage,
  pendingComponent: CampaignsSkeleton,
})

