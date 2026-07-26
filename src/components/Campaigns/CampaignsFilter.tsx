import { Stack, UnstyledButton, Group, Text } from '@mantine/core'
import { campaignFilters } from '#/configs/campaignFilters.config'

type FilterValue = 'All Campaigns' | 'Starred' | 'Drafts' | 'Running' | 'Paused' | 'Completed'

interface CampaignsFilterProps {
  activeFilter: FilterValue
  onFilterChange: (filter: FilterValue) => void
}

export function CampaignsFilter({ activeFilter, onFilterChange }: CampaignsFilterProps) {
  return (
    <Stack gap="xs">
      {campaignFilters?.map((filter) => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.label

        return (
          <UnstyledButton
            key={filter.label}
            onClick={() => onFilterChange(filter.label as FilterValue)}
            p="xs"
            style={(theme) => ({
              borderRadius: theme.radius.sm,
              backgroundColor: isActive ? 'var(--mantine-color-indigo-0)' : 'transparent',
              transition: 'background-color 150ms ease',
              '&:hover': {
                backgroundColor: isActive 
                  ? 'var(--mantine-color-indigo-0)' 
                  : 'var(--mantine-color-gray-0)',
              },
            })}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Icon 
                  size={16} 
                  style={{ 
                    color: filter.iconColor || (isActive ? 'var(--mantine-color-indigo-6)' : 'var(--mantine-color-gray-6)')
                  }} 
                />
                <Text
                  size="sm"
                  fw={isActive ? 600 : 400}
                  c={isActive ? 'indigo.6' : 'dark.7'}
                >
                  {filter.label}
                </Text>
              </Group>
              <Text
                size="xs"
                c={isActive ? 'indigo.6' : 'dimmed'}
                fw={isActive ? 600 : 400}
              >
                {filter.count}
              </Text>
            </Group>
          </UnstyledButton>
        )
      })}
    </Stack>
  )
}
