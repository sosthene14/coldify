import type { CampaignFilterItem } from '#/types/sidebar.ts';
import {
  IconFolder,
  IconLayoutGrid,
  IconPointFilled,
  IconStar,
} from '@tabler/icons-react'



export const campaignFilters: CampaignFilterItem[] = [
  { label: 'All Campaigns', count: 24, icon: IconLayoutGrid },
  { label: 'Starred', count: 6, icon: IconStar },
  { label: 'Drafts', count: 6, icon: IconFolder },
  { label: 'Running', count: 8, icon: IconPointFilled, iconColor: 'var(--mantine-color-green-6)' },
  { label: 'Paused', count: 4, icon: IconPointFilled, iconColor: 'var(--mantine-color-orange-6)' },
  { label: 'Completed', count: 6, icon: IconPointFilled, iconColor: 'var(--mantine-color-gray-5)' },
]