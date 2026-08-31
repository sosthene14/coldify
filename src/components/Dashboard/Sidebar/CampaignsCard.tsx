import { useState, useEffect } from 'react'
import { Group, Stack, Text, Modal, Divider, ScrollArea, Badge, Loader } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { 
  IconLayoutGrid, 
  IconClock, 
  IconSend, 
  IconAlertCircle 
} from '@tabler/icons-react'
import { SidebarCard } from './SidebarCard'
import axios from 'axios'
import { format } from 'date-fns'

// Filtres d'emails sans "Starred" et "Drafts"
const emailFilters = [
  { 
    label: 'all_emails', 
    count: 0, 
    icon: 'IconLayoutGrid',
    apiFilter: null 
  },
  { 
    label: 'scheduled', 
    count: 0, 
    icon: 'IconClock',
    apiFilter: 'pending',
    iconColor: 'var(--mantine-color-orange-6)'
  },
  { 
    label: 'sent', 
    count: 0, 
    icon: 'IconSend',
    apiFilter: 'sent',
    iconColor: 'var(--mantine-color-green-6)'
  },
  { 
    label: 'failed', 
    count: 0, 
    icon: 'IconAlertCircle',
    apiFilter: 'failed',
    iconColor: 'var(--mantine-color-red-6)'
  },
]

type EmailItem = {
  id: string
  subject: string
  status: string
  sentAt?: Date
  scheduledAt?: Date
  createdAt?: Date
  to: string[]
  type: 'sent' | 'scheduled'
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function CampaignsCard() {
  const { t } = useTranslation()
  const [opened, { open, close }] = useDisclosure(false)
  const [selected, setSelected] = useState<(typeof emailFilters)[number] | null>(null)
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [emailCounts, setEmailCounts] = useState<Record<string, number>>({})

  // Charger les compteurs d'emails
  const loadEmailCounts = async () => {
    try {
      const [sentResponse, scheduledResponse] = await Promise.all([
        axios.get(`${API_URL}/email-history`, { withCredentials: true }),
        axios.get(`${API_URL}/scheduled-emails`, { withCredentials: true })
      ])

      const sentEmails = Array.isArray(sentResponse.data?.data) ? sentResponse.data.data : (Array.isArray(sentResponse.data) ? sentResponse.data : [])
      const scheduledEmails = Array.isArray(scheduledResponse.data) ? scheduledResponse.data : []

      const counts = {
        all: sentEmails.length + scheduledEmails.length,
        sent: sentEmails.filter((e: any) => e.status === 'sent').length,
        failed: sentEmails.filter((e: any) => e.status === 'failed').length,
        pending: scheduledEmails.filter((e: any) => e.status === 'pending').length,
      }

      setEmailCounts(counts)
    } catch (error) {
      console.error('Failed to load email counts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Charger les emails pour un filtre spécifique
  const loadEmailsForFilter = async (filter: (typeof emailFilters)[number]) => {
    setModalLoading(true)
    try {
      const emailList: EmailItem[] = []

      if (!filter.apiFilter || filter.apiFilter === 'sent' || filter.apiFilter === 'failed') {
        // Charger les emails envoyés/échoués
        const response = await axios.get(`${API_URL}/email-history`, { withCredentials: true })
        const sentEmails = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : [])
        
        sentEmails
          .filter((email: any) => !filter.apiFilter || email.status === filter.apiFilter)
          .forEach((email: any) => {
            emailList.push({
              id: email.id,
              subject: email.subject,
              status: email.status,
              sentAt: email.sentAt ? new Date(email.sentAt) : undefined,
              createdAt: email.createdAt ? new Date(email.createdAt) : undefined,
              to: email.to,
              type: 'sent'
            })
          })
      }

      if (!filter.apiFilter || filter.apiFilter === 'pending') {
        // Charger les emails programmés
        const response = await axios.get(`${API_URL}/scheduled-emails`, { withCredentials: true })
        const scheduledEmails = Array.isArray(response.data) ? response.data : []

        scheduledEmails
          .filter((email: any) => !filter.apiFilter || email.status === filter.apiFilter)
          .forEach((email: any) => {
            emailList.push({
              id: email.id,
              subject: email.subject,
              status: email.status,
              scheduledAt: email.scheduledAt ? new Date(email.scheduledAt) : undefined,
              createdAt: email.createdAt ? new Date(email.createdAt) : undefined,
              to: email.to,
              type: 'scheduled'
            })
          })
      }

      // Trier par date (plus récent en premier)
      emailList.sort((a, b) => {
        const dateA = a.sentAt || a.scheduledAt || a.createdAt || new Date(0)
        const dateB = b.sentAt || b.scheduledAt || b.createdAt || new Date(0)
        return dateB.getTime() - dateA.getTime()
      })

      setEmails(emailList)
    } catch (error) {
      console.error('Failed to load emails:', error)
      setEmails([])
    } finally {
      setModalLoading(false)
    }
  }

  useEffect(() => {
    loadEmailCounts()
  }, [])

  const handleClick = async (item: (typeof emailFilters)[number]) => {
    setSelected(item)
    open()
    await loadEmailsForFilter(item)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'green'
      case 'pending': return 'orange'
      case 'failed': return 'red'
      case 'processing': return 'blue'
      case 'cancelled': return 'gray'
      default: return 'gray'
    }
  }

  const getEmailDate = (email: EmailItem) => {
    if (email.sentAt) return format(email.sentAt, 'MMM d, HH:mm')
    if (email.scheduledAt) return `${t('scheduled')}: ${format(email.scheduledAt, 'MMM d, HH:mm')}`
    if (email.createdAt) return format(email.createdAt, 'MMM d, HH:mm')
    return t('unknown_date')
  }

  // Mettre à jour les compteurs dans les filtres
  const filtersWithCounts = emailFilters.map(filter => ({
    ...filter,
    count: filter.apiFilter ? (emailCounts[filter.apiFilter] || 0) : (emailCounts.all || 0)
  }))

  return (
    <>
      <SidebarCard title={t('emails')} viewAllHref="/dashboard/mails">
        <Stack gap={2} className='w-auto'>
          {loading ? (
            <Group justify="center" py="md">
              <Loader size="xs" />
              <Text size="xs" c="dimmed">{t('loading')}</Text>
            </Group>
          ) : (
            filtersWithCounts.map((item) => (
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
                <Group gap={8} className='flex'>
                  {item.icon === 'IconLayoutGrid' && <IconLayoutGrid size={15} color={item.iconColor ?? 'var(--mantine-color-gray-6)'} />}
                  {item.icon === 'IconClock' && <IconClock size={15} color={item.iconColor ?? 'var(--mantine-color-gray-6)'} />}
                  {item.icon === 'IconSend' && <IconSend size={15} color={item.iconColor ?? 'var(--mantine-color-gray-6)'} />}
                  {item.icon === 'IconAlertCircle' && <IconAlertCircle size={15} color={item.iconColor ?? 'var(--mantine-color-gray-6)'} />}
                  <Text size="sm" c="dark.6">
                    {t(item.label)}
                  </Text>
                </Group>

                <Text size="sm" c="dimmed">
                  {item.count}
                </Text>
              </Group>
            ))
          )}
        </Stack>
      </SidebarCard>

      <Modal
        opened={opened}
        onClose={close}
        title={selected ? `${t('emails')} — ${t(selected.label)}` : t('emails')}
        size="md"
        radius="md"
        centered
        overlayProps={{ backgroundOpacity: 0.3, blur: 1 }}
      >
        <Divider mb="sm" color="gray.2" />

        {modalLoading ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">{t('loading_emails')}</Text>
          </Group>
        ) : emails.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            {t('no_emails_filter')}
          </Text>
        ) : (
          <ScrollArea.Autosize mah={400}>
            <Stack gap={4}>
              {emails.slice(0, 20).map((email) => (
                <Group
                  key={email.id}
                  justify="space-between"
                  className="rounded-md px-2 py-2 hover:bg-gray-50"
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" c="dark.7" truncate>
                      {email.subject}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {t('to')}: {email.to.join(', ')} • {getEmailDate(email)}
                    </Text>
                  </div>
                  <Badge 
                    size="sm" 
                    variant="light" 
                    color={getStatusColor(email.status)} 
                    radius="sm"
                  >
                    {email.status === 'pending' ? t('scheduled') : email.status}
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