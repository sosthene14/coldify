import { Anchor, Card, Container, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface LegalPageProps {
  type: 'privacy' | 'terms'
}

export function LegalPage({ type }: LegalPageProps) {
  const { t } = useTranslation()
  const isPrivacy = type === 'privacy'

  if (!isPrivacy) {
    const termSections = [
      ['terms_account_title', 'terms_account_content'],
      ['terms_provider_title', 'terms_provider_content'],
      ['terms_tracking_title', 'terms_tracking_content'],
      ['terms_acceptable_use_title', 'terms_acceptable_use_content'],
      ['terms_plans_title', 'terms_plans_content'],
      ['terms_termination_title', 'terms_termination_content'],
      ['terms_liability_title', 'terms_liability_content'],
      ['terms_contact_title', 'terms_contact_content'],
    ] as const

    return (
      <Container size="sm" py="xl" px="md">
        <Stack gap="lg">
          <Anchor component={Link} to="/register" size="sm">{t('back_to_registration')}</Anchor>
          <Title order={1}>{t('terms_of_service')}</Title>
          <Text c="dimmed">{t('legal_last_updated')}</Text>
          <Text>{t('terms_intro')}</Text>
          {termSections.map(([title, content]) => (
            <Stack key={title} gap="xs">
              <Title order={2}>{t(title)}</Title>
              <Text>{t(content)}</Text>
            </Stack>
          ))}
        </Stack>
      </Container>
    )
  }

  const principles = [
    ['privacy_principle_1_title', 'privacy_principle_1_description'],
    ['privacy_principle_2_title', 'privacy_principle_2_description'],
    ['privacy_principle_3_title', 'privacy_principle_3_description'],
  ] as const

  const dataRows = [
    ['privacy_data_email', 'privacy_data_email_purpose', 'privacy_data_email_retention'],
    ['privacy_data_metadata', 'privacy_data_metadata_purpose', 'privacy_data_metadata_retention'],
    ['privacy_data_events', 'privacy_data_events_purpose', 'privacy_data_events_retention'],
    ['privacy_data_connection', 'privacy_data_connection_purpose', 'privacy_data_connection_retention'],
  ] as const

  const notCollected = [1, 2, 3, 4, 5]
  const securityItems = [1, 2, 3, 4, 5, 6]

  return (
    <Container size="sm" py="xl" px="md">
      <Stack gap="lg">
        <Anchor component={Link} to="/register" size="sm">{t('back_to_registration')}</Anchor>
        <Stack gap="xs">
          <Text size="xs" tt="uppercase" c="blue" fw={700}>{t('privacy_eyebrow')}</Text>
          <Title order={1}>{t('privacy_policy')}</Title>
          <Text c="dimmed">{t('privacy_subtitle')}</Text>
          <Text size="sm" c="dimmed">{t('privacy_updated')}</Text>
        </Stack>

        <Divider />
        <Title order={2}>{t('privacy_principles_title')}</Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          {principles.map(([title, description]) => (
            <Card key={title} withBorder p="md">
              <Text fw={700} mb="xs">{t(title)}</Text>
              <Text size="sm" c="dimmed">{t(description)}</Text>
            </Card>
          ))}
        </SimpleGrid>

        <Title order={2}>{t('privacy_data_title')}</Title>
        <Text>{t('privacy_data_intro')}</Text>
        <Stack gap="xs">
          {dataRows.map(([label, purpose, retention]) => (
            <Card key={label} withBorder p="sm">
              <Text fw={600}>{t(label)}</Text>
              <Text size="sm">{t(purpose)}</Text>
              <Text size="xs" c="dimmed">{t(retention)}</Text>
            </Card>
          ))}
        </Stack>

        <Title order={2}>{t('privacy_not_collected_title')}</Title>
        <Stack gap={4}>{notCollected.map((item) => <Text key={item}>• {t(`privacy_not_collected_${item}`)}</Text>)}</Stack>

        <Title order={2}>{t('privacy_compliance_title')}</Title>
        <Text>{t('privacy_compliance_intro')}</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} withBorder p="md">
              <Text fw={600}>{t(`privacy_compliance_${item}_title`)}</Text>
              <Text size="sm" c="dimmed">{t(`privacy_compliance_${item}_description`)}</Text>
            </Card>
          ))}
        </SimpleGrid>

        <Title order={2}>{t('privacy_security_title')}</Title>
        <Text>{t('privacy_security_intro')}</Text>
        <Stack gap={4}>{securityItems.map((item) => <Text key={item}>• {t(`privacy_security_${item}`)}</Text>)}</Stack>

        <Title order={2}>{t('privacy_rights_title')}</Title>
        <Text>{t('privacy_rights_intro')}</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} withBorder p="md">
              <Text fw={600}>{t(`privacy_right_${item}_title`)}</Text>
              <Text size="sm" c="dimmed">{t(`privacy_right_${item}_description`)}</Text>
            </Card>
          ))}
        </SimpleGrid>

        <Title order={2}>{t('privacy_cookies_title')}</Title>
        <Text>{t('privacy_cookies_description')}</Text>
        <Title order={2}>{t('privacy_contact_title')}</Title>
        <Text>{t('privacy_contact_description')}</Text>
        <Text><strong>Email:</strong> privacy@so-mails.com</Text>
        <Text size="sm" c="dimmed">{t('privacy_contact_response')}</Text>
      </Stack>
    </Container>
  )
}