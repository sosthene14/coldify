import { useState } from 'react'
import { Text, Table, Badge, ActionIcon, Group, Menu, Button, Checkbox, Progress, Avatar } from '@mantine/core'
import { IconDots, IconStar, IconStarFilled, IconRocket, IconUsers, IconBuilding, IconShoppingCart, IconTrophy, IconSchool, IconBriefcase, IconHandGrab } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

type Status = 'Running' | 'Paused' | 'Draft' | 'Completed'

export interface Campaign {
  id: string
  name: string
  subtitle: string
  status: Status
  leads: number
  contacted: number
  contactedPercent: number
  replyRate: number
  lastActivity: string
  starred: boolean
  icon: any
  iconColor: string
  iconBg: string
}

const statusColor: Record<Status, string> = {
  Running: 'green',
  Paused: 'orange',
  Draft: 'gray',
  Completed: 'gray',
}

const campaignIcons: Record<string, { icon: any, color: string, bg: string }> = {
  rocket: { icon: IconRocket, color: '#339AF0', bg: '#E7F5FF' },
  users: { icon: IconUsers, color: '#5C7CFA', bg: '#EDF2FF' },
  building: { icon: IconBuilding, color: '#4C6EF5', bg: '#EDF2FF' },
  cart: { icon: IconShoppingCart, color: '#FD7E14', bg: '#FFF4E6' },
  trophy: { icon: IconTrophy, color: '#12B886', bg: '#E6FCF5' },
  school: { icon: IconSchool, color: '#E64980', bg: '#FFF0F6' },
  briefcase: { icon: IconBriefcase, color: '#4C6EF5', bg: '#EDF2FF' },
  handshake: { icon: IconHandGrab, color: '#FAB005', bg: '#FFF9DB' },
}

// Mock data matching the image
const mockCampaigns: Campaign[] = [
  { 
    id: '1', 
    name: 'Q3 SaaS Outreach', 
    subtitle: 'SaaS • North America',
    status: 'Running', 
    leads: 2450, 
    contacted: 1240,
    contactedPercent: 50.6,
    replyRate: 3.9,
    lastActivity: '2 min ago',
    starred: true,
    ...campaignIcons.rocket
  },
  { 
    id: '2', 
    name: 'YC Founders Outreach', 
    subtitle: 'Startup • United States',
    status: 'Paused', 
    leads: 680, 
    contacted: 320,
    contactedPercent: 47.1,
    replyRate: 5.2,
    lastActivity: '1 hour ago',
    starred: false,
    ...campaignIcons.users
  },
  { 
    id: '3', 
    name: 'Agency Outreach', 
    subtitle: 'Marketing • Global',
    status: 'Running', 
    leads: 1125, 
    contacted: 680,
    contactedPercent: 49.8,
    replyRate: 4.6,
    lastActivity: '3 hours ago',
    starred: false,
    ...campaignIcons.building
  },
  { 
    id: '4', 
    name: 'E-commerce Outreach', 
    subtitle: 'E-commerce • US, CA',
    status: 'Paused', 
    leads: 430, 
    contacted: 210,
    contactedPercent: 48.8,
    replyRate: 2.1,
    lastActivity: '5 hours ago',
    starred: true,
    ...campaignIcons.cart
  },
  { 
    id: '5', 
    name: 'Product Hunt Launch', 
    subtitle: 'Product • Global',
    status: 'Completed', 
    leads: 920, 
    contacted: 920,
    contactedPercent: 100,
    replyRate: 6.3,
    lastActivity: 'Yesterday',
    starred: false,
    ...campaignIcons.trophy
  },
  { 
    id: '6', 
    name: 'University Outreach', 
    subtitle: 'Education • United States',
    status: 'Draft', 
    leads: 210, 
    contacted: 0,
    contactedPercent: 0,
    replyRate: 0,
    lastActivity: '2 days ago',
    starred: false,
    ...campaignIcons.school
  },
  { 
    id: '7', 
    name: 'Enterprise Outreach', 
    subtitle: 'Enterprise • North America',
    status: 'Running', 
    leads: 1760, 
    contacted: 890,
    contactedPercent: 50.6,
    replyRate: 3.2,
    lastActivity: '2 days ago',
    starred: false,
    ...campaignIcons.briefcase
  },
  { 
    id: '8', 
    name: 'Partnership Outreach', 
    subtitle: 'Partnerships • Global',
    status: 'Completed', 
    leads: 350, 
    contacted: 350,
    contactedPercent: 100,
    replyRate: 7.4,
    lastActivity: '3 days ago',
    starred: false,
    ...campaignIcons.handshake
  },
]

interface CampaignsListProps {
  filterStatus?: Status | 'All' | 'Starred' | 'Archived'
  searchQuery?: string
}

export function CampaignsList({ filterStatus = 'All', searchQuery = '' }: CampaignsListProps) {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])

  const toggleStar = (id: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, starred: !c.starred } : c
    ))
  }

  const toggleSelect = (id: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([])
    } else {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id))
    }
  }

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filterStatus === 'Starred') {
      return campaign.starred
    }
    if (filterStatus === 'Archived') {
      return false // No archived campaigns in mock data
    }
    if (filterStatus !== 'All' && campaign.status !== filterStatus) {
      return false
    }
    return true
  })

  return (
    <div>
      <Table
        verticalSpacing="md"
        horizontalSpacing="md"
        highlightOnHover
        highlightOnHoverColor="gray.0"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}>
              <Checkbox
                checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                indeterminate={selectedCampaigns.length > 0 && selectedCampaigns.length < filteredCampaigns.length}
                onChange={toggleSelectAll}
              />
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Campaign
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Status
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Leads
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Contacted
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Reply Rate
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Last Activity
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Actions
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {filteredCampaigns.map((campaign) => {
            const Icon = campaign.icon
            
            return (
              <Table.Tr 
                key={campaign.id}
                style={{ cursor: 'pointer' }}
              >
                <Table.Td>
                  <Checkbox
                    checked={selectedCampaigns.includes(campaign.id)}
                    onChange={() => toggleSelect(campaign.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Table.Td>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <ActionIcon
                      variant="subtle"
                      color={campaign.starred ? 'yellow' : 'gray'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(campaign.id)
                      }}
                    >
                      {campaign.starred ? <IconStarFilled size={16} /> : <IconStar size={16} />}
                    </ActionIcon>
                    
                    <Avatar 
                      size={36} 
                      radius="md"
                      style={{ backgroundColor: campaign.iconBg }}
                    >
                      <Icon size={20} style={{ color: campaign.iconColor }} />
                    </Avatar>

                    <div>
                      <Text size="sm" fw={500} c="dark.9">
                        {campaign.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {campaign.subtitle}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={statusColor[campaign.status]} 
                    variant="dot" 
                    size="sm" 
                    radius="sm"
                  >
                    {campaign.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dark.9" fw={500}>
                    {campaign.leads.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <div style={{ width: 120 }}>
                    <Text size="xs" c="dimmed" mb={4}>
                      {campaign.contacted.toLocaleString()} ({campaign.contactedPercent.toFixed(1)}%)
                    </Text>
                    <Progress 
                      value={campaign.contactedPercent} 
                      color="blue" 
                      size="sm" 
                      radius="xl"
                    />
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dark.9" fw={500}>
                    {campaign.replyRate > 0 ? `${campaign.replyRate}%` : '0%'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Text size="sm" c="dimmed">
                      {campaign.lastActivity}
                    </Text>
                    {campaign.status === 'Running' && (
                      <div style={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: '#40C057' 
                      }} />
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Menu shadow="md" width={160} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon 
                          variant="subtle" 
                          color="gray" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item>Edit</Menu.Item>
                        <Menu.Item>Duplicate</Menu.Item>
                        <Menu.Item>Pause</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item color="red">Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                    
                    <Button 
                      size="xs" 
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate({ to: `/dashboard/campaigns/${campaign.id}` })
                      }}
                    >
                      View
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>

      <Group justify="space-between" mt="lg" p={3}>
        <Text size="sm" c="dimmed">
          Showing 1 to 8 of {filteredCampaigns.length} campaigns
        </Text>
      </Group>
    </div>
  )
}
