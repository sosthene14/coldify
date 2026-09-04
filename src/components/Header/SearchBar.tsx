import { useState, useRef, useEffect } from 'react'
import { 
  Kbd, 
  TextInput, 
  Modal, 
  Stack, 
  Text, 
  Group, 
  Badge, 
  ScrollArea, 
  Loader,
  ActionIcon,
  UnstyledButton
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { 
  IconSearch, 
  IconTemplate, 
  IconMail, 
  IconX,
  IconArrowRight
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useDebouncedValue, useHotkeys } from '@mantine/hooks'
import axios from 'axios'

interface SearchBarProps {
  placeholder?: string
}

interface SearchResult {
  id: string
  type: 'template' | 'email' | 'contact'
  title: string
  description: string
  url: string
  icon: React.ReactNode
  badge?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function SearchBar({ placeholder }: SearchBarProps) {
  const { t } = useTranslation()
  const [opened, setOpened] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // Hotkeys
  useHotkeys([
    ['mod+K', () => {
      setOpened(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }],
    ['Escape', () => setOpened(false)],
  ])

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const [templatesRes, emailHistoryRes] = await Promise.all([
        // Search templates
        axios.get(`${API_URL}/templates`, {
          withCredentials: true,
          params: { search: searchQuery, limit: 5 }
        }).catch(() => ({ data: [] })),
        
        // Search email history
        axios.get(`${API_URL}/email-history`, {
          withCredentials: true,
          params: { limit: 5 }
        }).catch(() => ({ data: { data: [] } }))
      ])

      const searchResults: SearchResult[] = []

      // Add template results
      if (templatesRes.data?.length) {
        templatesRes.data
          .filter((template: any) => 
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .forEach((template: any) => {
            searchResults.push({
              id: template.id,
              type: 'template',
              title: template.name,
              description: template.description || t('email_template'),
              url: `/dashboard/templates/${template.id}/edit`,
              icon: <IconTemplate size={16} />,
              badge: t('uses', { count: template.usageCount })
            })
          })
      }

      // Add email history results
      if (emailHistoryRes.data?.data?.length) {
        emailHistoryRes.data.data
          .filter((email: any) =>
            email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.to.some((recipient: string) => 
              recipient.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
          .slice(0, 3)
          .forEach((email: any) => {
            searchResults.push({
              id: email.id,
              type: 'email',
              title: email.subject,
              description: `${t('to')}: ${email.to.join(', ')}`,
              url: `/dashboard/mails`,
              icon: <IconMail size={16} />,
              badge: email.status
            })
          })
      }

      setResults(searchResults)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Search when debounced query changes
  useEffect(() => {
    if (opened && debouncedQuery) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
    }
  }, [debouncedQuery, opened])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    }
  }

  const handleSelect = (result: SearchResult) => {
    navigate({ to: result.url })
    setOpened(false)
    setQuery('')
    setSelectedIndex(-1)
  }

  const handleClose = () => {
    setOpened(false)
    setQuery('')
    setSelectedIndex(-1)
    setResults([])
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template': return 'blue'
      case 'email': return 'green'
      case 'contact': return 'orange'
      default: return 'gray'
    }
  }

  return (
    <>
      {/* Desktop SearchBar - clickable to open modal */}
      <TextInput
        placeholder={placeholder || t('search')}
        radius="sm"
        leftSection={<IconSearch size={16} />}
        rightSection={<Kbd size="xs">⌘K</Kbd>}
        rightSectionWidth={42}
        w={{ base: 140, sm: 200, md: 280 }}
        visibleFrom="sm"
        onClick={() => setOpened(true)}
        readOnly
        style={{ cursor: 'pointer' }}
        styles={{
          input: {
            '@media (max-width: 768px)': {
              fontSize: '13px',
            }
          }
        }}
      />

      {/* Mobile SearchBar - button to open modal */}
      <ActionIcon
        variant="default"
        size="lg"
        hiddenFrom="sm"
        onClick={() => setOpened(true)}
        radius="sm"
      >
        <IconSearch size={18} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={null}
        withCloseButton={false}
        size="lg"
        padding={0}
        radius="md"
        centered
     
      >
        <Stack gap={0}>
          {/* Search Input */}
          <Group p="md" gap="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
            <IconSearch size={20} color="var(--mantine-color-dimmed)" />
            <TextInput
              ref={inputRef}
              placeholder={t('search_templates_emails_contacts')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="unstyled"
              size="md"
              style={{ flex: 1 }}
            />
            <ActionIcon variant="subtle" onClick={handleClose}>
              <IconX size={16} />
            </ActionIcon>
          </Group>

          {/* Results */}
          <ScrollArea.Autosize mah={400}>
            {loading ? (
              <Group justify="center" p="xl">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">{t('searching')}</Text>
              </Group>
            ) : results.length > 0 ? (
              <Stack gap={0}>
                {results.map((result, index) => (
                  <UnstyledButton
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    p="md"
                    style={{
                      backgroundColor: index === selectedIndex 
                        ? 'var(--mantine-color-gray-1)' 
                        : 'transparent',
                      borderRadius: 0,
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    <Group gap="md" justify="space-between">
                      <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                        {result.icon}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Group gap="xs" align="center">
                            <Text size="sm" fw={500} truncate style={{ flex: 1 }}>
                              {result.title}
                            </Text>
                            <Badge 
                              size="xs" 
                              variant="light" 
                              color={getTypeColor(result.type)}
                            >
                              {result.type}
                            </Badge>
                            {result.badge && (
                              <Badge size="xs" variant="outline">
                                {result.badge}
                              </Badge>
                            )}
                          </Group>
                          <Text size="xs" c="dimmed" truncate>
                            {result.description}
                          </Text>
                        </div>
                      </Group>
                      <IconArrowRight size={14} color="var(--mantine-color-dimmed)" />
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            ) : query.trim() ? (
              <Group justify="center" p="xl">
                <Stack align="center" gap="xs">
                  <IconSearch size={32} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" c="dimmed">{t('no_results_for', { query })}</Text>
                  <Text size="xs" c="dimmed">
                    {t('try_searching')}
                  </Text>
                </Stack>
              </Group>
            ) : (
              <Group justify="center" p="xl">
                <Stack align="center" gap="xs">
                  <IconSearch size={32} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" c="dimmed">{t('start_typing_search')}</Text>
                  <Text size="xs" c="dimmed">
                    {t('find_templates_emails')}
                  </Text>
                </Stack>
              </Group>
            )}
          </ScrollArea.Autosize>

          {/* Footer */}
          {!loading && (
            <Group 
              justify="space-between" 
              p="sm" 
              style={{ 
                borderTop: '1px solid var(--mantine-color-gray-3)',
                fontSize: 'var(--mantine-font-size-xs)'
              }}
            >
              <Group gap="md">
                <Group gap="xs">
                  <Kbd size="xs">↑↓</Kbd>
                  <Text size="xs" c="dimmed">{t('navigate')}</Text>
                </Group>
                <Group gap="xs">
                  <Kbd size="xs">↵</Kbd>
                  <Text size="xs" c="dimmed">{t('select')}</Text>
                </Group>
                <Group gap="xs">
                  <Kbd size="xs">Esc</Kbd>
                  <Text size="xs" c="dimmed">{t('close')}</Text>
                </Group>
              </Group>
              <Text size="xs" c="dimmed">
                {t('results_count', { count: results.length })}
              </Text>
            </Group>
          )}
        </Stack>
      </Modal>
    </>
  )
}