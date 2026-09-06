import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Stack, Text, Button, Group, Card, Grid, Badge, ActionIcon, Menu, TextInput, Select, Tabs, Divider, Modal } from '@mantine/core'
import { IconPlus, IconSearch, IconDots, IconEdit, IconCopy, IconTrash, IconStar, IconStarFilled, IconMail, IconClock, IconChartLine, IconMailOff, IconTemplate, IconEye } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import toast from 'react-hot-toast'
import { TemplatesSkeleton } from '#/components/Templates/TemplatesSkeleton'
import { useTemplateStore } from '#/stores/template.store.ts';
import { useEffect, useState, useMemo } from 'react'
import type { Template } from '#/types/template.ts'

export const Route = createFileRoute('/dashboard/templates/')({
  component: TemplatesPage,
  pendingComponent: TemplatesSkeleton,
})

const categories = ['all_categories', 'Professional', 'Sales', 'Marketing', 'Follow-up', 'Personal', 'Transactional', 'Newsletter', 'Support', 'Recruitment', 'Networking']

type TabValue = 'all' | 'starred' | 'recent'
type SortOption = 'most_used' | 'highest_open_rate' | 'recently_created' | 'recently_used'

function TemplatesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { templates, isLoading, fetchTemplates, starTemplate, unstarTemplate, deleteTemplate, duplicateTemplate } = useTemplateStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  
  // Filters state
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all_categories')
  const [sortBy, setSortBy] = useState<SortOption>('most_used')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const formatRelativeTime = (dateStr?: string): string => {
    if (!dateStr) return t('never_used')
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return t('used_today')
    if (diffDays === 1) return t('used_yesterday')
    return t('used_days_ago', { count: diffDays })
  }

  // Filtered and sorted templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates]

    // Filter by tab
    if (activeTab === 'starred') {
      result = result.filter(t => t.starred)
    } else if (activeTab === 'recent') {
      result = result.filter(t => t.lastUsedAt)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.preview?.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all_categories') {
      result = result.filter(t => t.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'most_used':
        result.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        break
      case 'highest_open_rate':
        result.sort((a, b) => (b.openRate || 0) - (a.openRate || 0))
        break
      
      case 'recently_created':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'recently_used':
        result.sort((a, b) => {
          if (!a.lastUsedAt) return 1
          if (!b.lastUsedAt) return -1
          return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
        })
        break
    }

    return result
  }, [templates, activeTab, searchQuery, selectedCategory, sortBy])

  const starredCount = templates.filter(t => t.starred).length
  const recentCount = templates.filter(t => t.lastUsedAt).length

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalTemplates = templates.length
    const totalUsage = templates.reduce((sum, t) => sum + (t.usageCount || 0), 0)
    const avgOpenRate = templates.length > 0 
      ? templates.reduce((sum, t) => sum + (t.openRate || 0), 0) / templates.length 
      : 0
    
    return {
      totalTemplates,
      totalUsage,
      avgOpenRate: avgOpenRate.toFixed(1)
    }
  }, [templates])

  const handleToggleStar = async (e: React.MouseEvent, template: Template) => {
    e.stopPropagation()
    if (template.starred) {
      await unstarTemplate(template.id)
    } else {
      await starTemplate(template.id)
    }
  }

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await duplicateTemplate(id)
      toast.success(t('template_duplicated'))
    } catch (error) {
      toast.error(t('failed_duplicate_template'))
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setTemplateToDelete(id)
    openDeleteModal()
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    setDeletingId(templateToDelete)
    try {
      await deleteTemplate(templateToDelete)
      toast.success(t('template_deleted'))
      closeDeleteModal()
    } catch (error) {
      toast.error(t('failed_delete_template'))
    } finally {
      setDeletingId(null)
      setTemplateToDelete(null)
    }
  }

  if (isLoading && templates.length === 0) {
    return <TemplatesSkeleton />
  }

  return (
    <div className='mx-0 md:mx-10 pt-2 md:pt-4 px-2 md:px-0'>
      <Stack  >
        {/* Header */}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
          <div>
            <Text size="xl" fw={700}>
              {t('email_templates')}
            </Text>
            <Group gap={6} mt={4} visibleFrom="sm">
              <Text size="sm" c="dimmed">
                {t('templates_count', { count: templates.length })}
              </Text>
              <Text size="sm" c="dimmed">•</Text>
              <Text size="sm" c="dimmed">
                {t('starred_count', { count: starredCount })}
              </Text>
            </Group>
          </div>
          <Button
            data-onboarding="templates-create"
            leftSection={<IconPlus size={16} />}
            color="blue"
            radius='sm'
            onClick={() => navigate({ to: '/dashboard/templates/new' })}
          >
            <span className="hidden sm:inline">{t('new_template')}</span>
            <span className="sm:hidden">{t('new_template_short')}</span>
          </Button>
        </Group>

        {/* KPIs Row - Compact */}
        <Card withBorder p={{ base: 'xs', sm: 'sm', md: 'md' }} radius="md">
          <Group grow>
            <div style={{ borderRight: '1px solid var(--mantine-color-gray-3)', paddingRight: 12 }}>
              <Group gap="xs" mb={4}>
                <IconTemplate size={16} color="var(--mantine-color-blue-6)" />
                <Text size="xs" c="dimmed" fw={500}>
                  {t('templates')}
                </Text>
              </Group>
              <Text size="lg" fw={700}>
                {kpis.totalTemplates}
              </Text>
            </div>

            <div style={{ borderRight: '1px solid var(--mantine-color-gray-3)', paddingRight: 12 }}>
              <Group gap="xs" mb={4}>
                <IconMail size={16} color="var(--mantine-color-cyan-6)" />
                <Text size="xs" c="dimmed" fw={500}>
                  {t('usage')}
                </Text>
              </Group>
              <Text size="lg" fw={700}>
                {kpis.totalUsage}
              </Text>
            </div>

            <div>
              <Group gap="xs" mb={4}>
                <IconEye size={16} color="var(--mantine-color-green-6)" />
                <Text size="xs" c="dimmed" fw={500}>
                  {t('avg_open')}
                </Text>
              </Group>
              <Text size="lg" fw={700} c="green">
                {kpis.avgOpenRate}%
              </Text>
            </div>
          </Group>
        </Card>        {/* Tabs + filtres */}
        <Card withBorder radius="md" p={{ base: 'xs', sm: 'sm', md: 'md' }} bg="white">
          <Stack gap="sm">
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value as TabValue)} variant="pills" color="blue">
              <Tabs.List>
                <Tabs.Tab value="all">
                  <span className="hidden sm:inline">{t('all_templates')}</span>
                  <span className="sm:hidden">{t('all')}</span>
                  <Badge size="sm" ml={6} variant="light" color="gray">{templates.length}</Badge>
                </Tabs.Tab>
                <Tabs.Tab value="starred">
                  <span className="hidden sm:inline">{t('starred')}</span>
                  <span className="sm:hidden">★</span>
                  <Badge size="sm" ml={6} variant="light" color="gray">{starredCount}</Badge>
                </Tabs.Tab>
                <Tabs.Tab value="recent">
                  <span className="hidden sm:inline">{t('recently_used')}</span>
                  <span className="sm:hidden">{t('recent')}</span>
                  <Badge size="sm" ml={6} variant="light" color="gray">{recentCount}</Badge>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Divider />

            <Stack gap="xs">
              <TextInput
                placeholder={t('search_templates')}
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Group gap="xs">
                <Select
                  placeholder={t('category_sort')}
                  data={categories}
                  style={{ flex: 1 }}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value || 'all_categories')}
                />
                <Select
                  placeholder={t('sort_by')}
                  data={['most_used', 'highest_open_rate', 'recently_created', 'recently_used'] as SortOption[]}
                  style={{ flex: 1 }}
                  value={sortBy}
                  onChange={(value) => setSortBy(value as SortOption)}
                />
              </Group>
            </Stack>
          </Stack>
        </Card>

       {filteredTemplates.length === 0 ? (
  <Card withBorder radius="md" p={{ base: 'md', sm: 'lg', md: 'xl' }} bg="white" className='mb-10'>
    <Stack align="center"  >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'var(--mantine-color-blue-0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconMailOff size={32} color="var(--mantine-color-blue-6)" stroke={1.5} />
      </div>

      <Stack align="center" gap={4}>
        <Text size="lg" fw={700} c="dark.8" ta="center">
          {templates.length === 0 ? t('no_templates_yet') : t('no_templates_match')}
        </Text>
        <Text size="sm" c="dimmed" ta="center" style={{ maxWidth: 400 }}>
          {templates.length === 0
            ? t('create_first_template_desc')
            : t('try_adjusting_template_filters')}
        </Text>
      </Stack>

      {templates.length === 0 && (
        <Button
          leftSection={<IconPlus size={16} />}
          color="blue"
          variant="filled"
          radius="sm"
          onClick={() => navigate({ to: '/dashboard/templates/new' })}
        >
          {t('create_first_template')}
        </Button>
      )}
    </Stack>
  </Card>
        ) : (
          <Grid>
            {filteredTemplates.map((template) => (
              <Grid.Col key={template.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  withBorder
                  radius="md"
                  p={{ base: 'sm', sm: 'md', md: 'lg' }}
                  bg="white"
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'border-color 150ms ease',
                    opacity: deletingId === template.id ? 0.5 : 1,
                  }}
                  className="hover:border-gray-400"
                  onClick={() => navigate({ to: `/dashboard/templates/${template.id}/edit` })}
                >
                  <Stack gap="sm" h="100%">
                    <Group justify="space-between" wrap="nowrap" align="flex-start">
                      <Badge size="sm" variant="light" color="gray" radius="sm">
                        {template.category}
                      </Badge>

                      <Group gap={2} wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          color={template.starred ? 'blue' : 'gray'}
                          size="sm"
                          onClick={(e) => handleToggleStar(e, template)}
                        >
                          {template.starred ? <IconStarFilled size={16} /> : <IconStar size={16} />}
                        </ActionIcon>

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
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate({ to: `/dashboard/templates/${template.id}/edit` })
                              }}
                            >
                              {t('edit')}
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconChartLine size={14} />}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate({ to: `/dashboard/templates/${template.id}/stats` })
                              }}
                            >
                              {t('view_stats')}
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconCopy size={14} />}
                              onClick={(e) => handleDuplicate(e, template.id)}
                            >
                              {t('duplicate')}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={14} />}
                              onClick={(e) => handleDelete(e, template.id)}
                            >
                              {t('delete')}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>

                    <div>
                      <Text size="md" fw={600} mb={6} lineClamp={1}>
                        {template.name}
                      </Text>
                      <Group gap={4} mb={6} wrap="nowrap">
                        <IconMail size={13} color="var(--mantine-color-gray-6)" style={{ flexShrink: 0 }} />
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {template.subject}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={2} style={{ lineHeight: 1.5 }}>
                        {template.preview}
                      </Text>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <Divider mb={10} />

                      <Group justify="space-between" mb={4}>
                        <Group gap={4}>
                          <IconClock size={12} color="var(--mantine-color-gray-5)" />
                          <Text size="xs" c="dimmed">{formatRelativeTime(template.lastUsedAt || undefined)}</Text>
                        </Group>
                        <Text size="xs" fw={500} c="dimmed">{t('uses', { count: template.usageCount })}</Text>
                      </Group>

                      <Group gap="lg" mt={4}>
                        <Text size="xs" c="dimmed">
                          {t('open')} <Text component="span" fw={600} c="dark">{template.openRate || 0}%</Text>
                        </Text>
                      </Group>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('delete_template')}
        centered
      >
        <Stack gap="md">
          <Text size="sm">{t('delete_template_confirm')}</Text>
          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" onClick={closeDeleteModal}>
              {t('cancel')}
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={deletingId !== null}
            >
              {t('delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
}