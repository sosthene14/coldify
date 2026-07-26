import { useState } from 'react'
import { Group, Stack, Text, Modal, Divider, ScrollArea, Badge } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { SidebarCard } from './SidebarCard'
import { campaignFilters } from '#/configs/campaignFilters.config.ts'

type Campaign = {
  id: string
  name: string
  status: string
  filterLabel: string // correspond au `label` du filtre cliqué
}

// Données mockées — à remplacer par un vrai fetch plus tard
const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer Sale 2026', status: 'Active', filterLabel: 'Active' },
  { id: '2', name: 'Black Friday Teaser', status: 'Active', filterLabel: 'Active' },
  { id: '3', name: 'Newsletter Q3', status: 'Active', filterLabel: 'Active' },
  { id: '4', name: 'Onboarding Flow', status: 'Draft', filterLabel: 'Draft' },
  { id: '5', name: 'Referral Program', status: 'Draft', filterLabel: 'Draft' },
  { id: '6', name: 'Winter Promo 2025', status: 'Completed', filterLabel: 'Completed' },
  { id: '7', name: 'Spring Launch', status: 'Completed', filterLabel: 'Completed' },
  { id: '8', name: 'Legacy Campaign', status: 'Archived', filterLabel: 'Archived' },
]

export function CampaignsCard() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selected, setSelected] = useState<(typeof campaignFilters)[number] | null>(null)

  const filteredCampaigns = selected
    ? MOCK_CAMPAIGNS.filter((c) => c.filterLabel === selected.label)
    : []

  const handleClick = (item: (typeof campaignFilters)[number]) => {
    setSelected(item)
    open()
  }

  return (
    <>
      <SidebarCard title="Campaigns" viewAllHref="/campaigns">
        <Stack gap={2}>
          {campaignFilters.map((item) => (
            <Group
              key={item.label}
              justify="space-between"
              onClick={() => handleClick(item)}
              className="
                rounded-lg
                px-1 py-1.5
                cursor-pointer
                transition-colors
                duration-150
                hover:bg-gray-100
              "
            >
              <Group gap={8}>
                <item.icon
                  size={15}
                  color={item.iconColor ?? 'var(--mantine-color-gray-6)'}
                />
                <Text size="sm" c="dark.6">
                  {item.label}
                </Text>
              </Group>

              <Text size="sm" c="dimmed">
                {item.count}
              </Text>
            </Group>
          ))}
        </Stack>
      </SidebarCard>

      <Modal
        opened={opened}
        onClose={close}
        title={selected ? `Campaigns — ${selected.label}` : 'Campaigns'}
        size="md"
        radius="md"
        centered
        overlayProps={{ backgroundOpacity: 0.3, blur: 1 }}
      >
        <Divider mb="sm" color="gray.2" />

        {filteredCampaigns.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            No campaigns found for this filter.
          </Text>
        ) : (
          <ScrollArea.Autosize mah={400}>
            <Stack gap={4}>
              {filteredCampaigns.map((campaign) => (
                <Group
                  key={campaign.id}
                  justify="space-between"
                  className="rounded-md px-2 py-2 hover:bg-gray-50"
                >
                  <Text size="sm" c="dark.7">
                    {campaign.name}
                  </Text>
                  <Badge size="sm" variant="light" color="blue" radius="sm">
                    {campaign.status}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        )}
      </Modal>
    </>
  )
}