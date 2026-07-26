import { Stack, UnstyledButton, Group, Text, Button } from '@mantine/core'
import { IconLayoutGrid, IconStar, IconArchive, IconFolder, IconPlus, IconPoint } from '@tabler/icons-react'

interface SidebarItem {
  label: string
  count: number
  icon: any
  iconColor?: string
}

interface CampaignsSidebarProps {
  activeItem: string
  onItemChange: (item: string) => void
}

const campaignItems: SidebarItem[] = [
  { label: 'All Campaigns', count: 24, icon: IconLayoutGrid },
  { label: 'Starred', count: 5, icon: IconStar },
  { label: 'Archived', count: 9, icon: IconArchive },
]

const folderItems: SidebarItem[] = [
  { label: 'Outbound Q2', count: 7, icon: IconFolder },
  { label: 'SaaS Outreach', count: 5, icon: IconFolder },
  { label: 'Agencies', count: 4, icon: IconFolder },
  { label: 'North America', count: 3, icon: IconFolder },
  { label: 'Enterprise', count: 2, icon: IconFolder },
]

const statusItems: SidebarItem[] = [
  { label: 'Running', count: 8, icon: IconPoint, iconColor: '#40C057' },
  { label: 'Paused', count: 4, icon: IconPoint, iconColor: '#FD7E14' },
  { label: 'Completed', count: 6, icon: IconPoint, iconColor: '#868E96' },
  { label: 'Draft', count: 6, icon: IconPoint, iconColor: '#868E96' },
]

export function CampaignsSidebar({ activeItem, onItemChange }: CampaignsSidebarProps) {
  const renderItem = (item: SidebarItem, isActive: boolean) => {
    const Icon = item.icon
    
    return (
      <UnstyledButton
        key={item.label}
        onClick={() => onItemChange(item.label)}
        py={8}
        px={12}
        w="100%"
        style={{
          borderRadius: 6,
          backgroundColor: isActive ? '#F0F1FF' : 'transparent',
          transition: 'background-color 150ms ease',
        }}
      >
       <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
  <Group gap={8} wrap="nowrap" style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
    <Icon 
      size={16}
      style={{ 
        color: item.iconColor || (isActive ? '#5C7CFA' : '#868E96'),
        flexShrink: 0
      }} 
    />
    <Text
      size="sm"
      fw={isActive ? 500 : 400}
      c={isActive ? 'dark.9' : 'dark.7'}
      style={{ 
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 0
      }}
    >
      {item.label}
    </Text>
  </Group>
  <Text
    size="sm"
    c={isActive ? 'indigo.6' : 'dimmed'}
    fw={isActive ? 500 : 400}
    style={{ flexShrink: 0 }}
  >
    {item.count}
  </Text>
</Group>
      </UnstyledButton>
    )
  }

  return (
    <Stack gap={0} className='w-auto'>
      {/* Campaigns Section */}
      <Stack gap={2} mb={24}>
        <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={4} px={12}>
          Campaigns
        </Text>
        {campaignItems.map(item => renderItem(item, activeItem === item.label))}
      </Stack>

      {/* Folders Section */}
      <Stack gap={2} mb={24}>
        <Group justify="space-between" px={12} mb={4}>
          <Text size="xs" fw={600} c="dimmed" tt="uppercase">
            Folders
          </Text>
           
        </Group>
        {folderItems?.map(item => renderItem(item, activeItem === item.label))}
        <Button
          variant="subtle"
          size="xs"
          color="blue"
          leftSection={<IconPlus size={14} />}
          mt={4}
          style={{ justifyContent: 'flex-start' }}
        >
          New Folder
        </Button>
      </Stack>

      {/* Status Section */}
      <Stack gap={2}>
        <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={4} px={12}>
          Status
        </Text>
        {statusItems.map(item => renderItem(item, activeItem === item.label))}
      </Stack>
    </Stack>
  )
}
