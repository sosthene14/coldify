import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Stack,
  Text,
  Button,
  Group,
  Card,
  Badge,
  TextInput,
  Select,
  Switch,
  Divider,
  UnstyledButton,
  Avatar,
  Table,
  ActionIcon,
  Menu,
  Progress,
  Paper,
  ThemeIcon,
  PasswordInput,
  Textarea,
  RingProgress,
  CopyButton,
  Tooltip,
} from '@mantine/core'
import {
  IconUser,
  IconMail,
  IconWorld,
  IconUsers,
  IconBell,
  IconPlug,
  IconCreditCard,
  IconListDetails,
  IconShieldCheck,
  IconLock,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconPlus,
  IconDots,
  IconTrash,
  IconEdit,
  IconCopy,
  IconRefresh,
  IconBrandGoogle,
  IconBrandSlack,
  IconCalendarEvent,
  IconWebhook,
  IconKey,
  IconDeviceLaptop,
  IconFlame,
} from '@tabler/icons-react'

 

type Section =
  | 'profile' | 'mailboxes' | 'domain' | 'team' | 'notifications'
  | 'integrations' | 'billing' | 'customFields' | 'compliance' | 'security'

const navItems: { section: Section; label: string; icon: any }[] = [
  { section: 'profile', label: 'Profile & Account', icon: IconUser },
  { section: 'mailboxes', label: 'Mailboxes', icon: IconMail },
  { section: 'domain', label: 'Domain & Deliverability', icon: IconWorld },
  { section: 'team', label: 'Team & Permissions', icon: IconUsers },
  { section: 'notifications', label: 'Notifications', icon: IconBell },
  { section: 'integrations', label: 'Integrations', icon: IconPlug },
  { section: 'billing', label: 'Billing & Plan', icon: IconCreditCard },
  { section: 'customFields', label: 'Custom Fields', icon: IconListDetails },
  { section: 'compliance', label: 'Compliance & GDPR', icon: IconShieldCheck },
  { section: 'security', label: 'Security', icon: IconLock },
]

const mailboxes = [
  { email: 'john@acme.com', provider: 'Gmail', status: 'connected', dailyLimit: 80, warmup: 100 },
  { email: 'sales@acme.com', provider: 'Outlook', status: 'connected', dailyLimit: 60, warmup: 62 },
  { email: 'marc@acme.com', provider: 'SMTP', status: 'error', dailyLimit: 50, warmup: 0 },
]

const teamMembers = [
  { name: 'John Doe', email: 'john@acme.com', role: 'Admin', status: 'active' },
  { name: 'Sarah Lee', email: 'sarah@acme.com', role: 'Manager', status: 'active' },
  { name: 'Marc Diop', email: 'marc@acme.com', role: 'Sales Rep', status: 'active' },
  { name: 'fatou@agency.com', email: 'fatou@agency.com', role: 'Sales Rep', status: 'pending' },
]

const customFields = [
  { name: 'Department', type: 'Text' },
  { name: 'Annual Revenue', type: 'Text' },
  { name: 'Tech Stack', type: 'Text' },
  { name: 'Contract Renewal Date', type: 'Date' },
  { name: 'Deal Stage', type: 'Select' },
]

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <Text size="lg" fw={700}>{title}</Text>
      {description && <Text size="sm" c="dimmed" mt={2}>{description}</Text>}
    </div>
  )
}

export function SettingsPage() {
  const [active, setActive] = useState<Section>('profile')

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Text size="xl" fw={700}>Settings</Text>

        <Group align="flex-start" gap="md" wrap="nowrap">
          {/* ============================================================ */}
          {/* SIDEBAR */}
          {/* ============================================================ */}
          <Card withBorder radius="md" p="sm" bg="white" style={{ width: 240, flexShrink: 0 }}>
            <Stack gap={2}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = active === item.section
                return (
                  <UnstyledButton
                    key={item.section}
                    onClick={() => setActive(item.section)}
                    py={8}
                    px={10}
                    style={{
                      borderRadius: 6,
                      backgroundColor: isActive ? '#EDF2FF' : 'transparent',
                    }}
                  >
                    <Group gap={8} wrap="nowrap">
                      <Icon size={16} color={isActive ? '#4C6EF5' : '#868E96'} />
                      <Text size="sm" fw={isActive ? 600 : 400} c={isActive ? 'dark.9' : 'dark.7'}>
                        {item.label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                )
              })}
            </Stack>
          </Card>

          {/* ============================================================ */}
          {/* CONTENT */}
          {/* ============================================================ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack gap="md">

              {/* ---------------- PROFILE ---------------- */}
              {active === 'profile' && (
                <>
                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="Profile" description="Your personal information" />
                    <Divider my="md" />
                    <Group align="flex-start" gap="xl">
                      <Stack align="center" gap={8}>
                        <Avatar size={80} radius="xl" color="indigo">JD</Avatar>
                        <Button size="xs" variant="default">Change photo</Button>
                      </Stack>
                      <Stack gap="sm" style={{ flex: 1 }}>
                        <Group grow>
                          <TextInput label="First name" defaultValue="John" />
                          <TextInput label="Last name" defaultValue="Doe" />
                        </Group>
                        <TextInput label="Email" defaultValue="john@acme.com" />
                        <Group grow>
                          <Select label="Timezone" defaultValue="America/Los_Angeles" data={['America/Los_Angeles', 'America/New_York', 'Europe/Paris', 'Africa/Dakar']} />
                          <Select label="Interface language" defaultValue="English" data={['English', 'Français', 'Español']} />
                        </Group>
                      </Stack>
                    </Group>
                    <Group justify="flex-end" mt="md">
                      <Button>Save changes</Button>
                    </Group>
                  </Card>

                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="Password" />
                    <Divider my="md" />
                    <Stack gap="sm" maw={400}>
                      <PasswordInput label="Current password" />
                      <PasswordInput label="New password" />
                      <PasswordInput label="Confirm new password" />
                    </Stack>
                    <Group justify="flex-end" mt="md">
                      <Button variant="default">Update password</Button>
                    </Group>
                  </Card>
                </>
              )}

              {/* ---------------- MAILBOXES ---------------- */}
              {active === 'mailboxes' && (
                <Card withBorder radius="md" p="lg" bg="white">
                  <Group justify="space-between" mb="md">
                    <SectionHeader title="Connected Mailboxes" description="Manage the accounts you send from" />
                    <Button leftSection={<IconPlus size={16} />}>Connect Mailbox</Button>
                  </Group>

                  <Stack gap="sm">
                    {mailboxes.map((mb) => (
                      <Paper key={mb.email} withBorder p="md" radius="md">
                        <Group justify="space-between" mb="sm">
                          <Group gap={10}>
                            <ThemeIcon variant="light" color={mb.status === 'connected' ? 'green' : 'red'} size="lg" radius="xl">
                              <IconMail size={16} />
                            </ThemeIcon>
                            <div>
                              <Text size="sm" fw={600}>{mb.email}</Text>
                              <Text size="xs" c="dimmed">{mb.provider}</Text>
                            </div>
                          </Group>
                          <Group gap={8}>
                            <Badge color={mb.status === 'connected' ? 'green' : 'red'} variant="light">
                              {mb.status === 'connected' ? 'Connected' : 'Auth Error'}
                            </Badge>
                            <Menu shadow="md" width={160}>
                              <Menu.Target>
                                <ActionIcon variant="subtle" color="gray"><IconDots size={16} /></ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEdit size={14} />}>Edit signature</Menu.Item>
                                <Menu.Item leftSection={<IconRefresh size={14} />}>Reconnect</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item color="red" leftSection={<IconTrash size={14} />}>Disconnect</Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Group>

                        <Group grow>
                          <div>
                            <Group justify="space-between" mb={4}>
                              <Text size="xs" c="dimmed">Daily limit</Text>
                              <Text size="xs" fw={500}>{mb.dailyLimit} emails/day</Text>
                            </Group>
                            <Progress value={60} size={4} radius="xl" color="blue" />
                          </div>
                          <div>
                            <Group justify="space-between" mb={4}>
                              <Group gap={4}>
                                <IconFlame size={12} color="#F59F00" />
                                <Text size="xs" c="dimmed">Warm-up progress</Text>
                              </Group>
                              <Text size="xs" fw={500}>{mb.warmup}%</Text>
                            </Group>
                            <Progress value={mb.warmup} size={4} radius="xl" color="orange" />
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>

                  <Divider my="md" />
                  <Switch label="Rotate sending across mailboxes (round-robin)" defaultChecked description="Distribute emails automatically across all connected mailboxes" />
                </Card>
              )}

              {/* ---------------- DOMAIN & DELIVERABILITY ---------------- */}
              {active === 'domain' && (
                <>
                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="DNS & Authentication" description="Required for good deliverability" />
                    <Divider my="md" />
                    <Stack gap="sm">
                      {[
                        { label: 'SPF Record', status: true },
                        { label: 'DKIM Record', status: true },
                        { label: 'DMARC Record', status: false },
                      ].map((rec) => (
                        <Group key={rec.label} justify="space-between">
                          <Group gap={8}>
                            {rec.status ? <IconCheck size={16} color="#40C057" /> : <IconX size={16} color="#FA5252" />}
                            <Text size="sm">{rec.label}</Text>
                          </Group>
                          <Badge color={rec.status ? 'green' : 'red'} variant="light">
                            {rec.status ? 'Verified' : 'Missing'}
                          </Badge>
                        </Group>
                      ))}
                    </Stack>
                    <Paper mt="md" p="sm" radius="md" bg="orange.0" withBorder style={{ borderColor: '#FFD8A8' }}>
                      <Group gap={8}>
                        <IconAlertTriangle size={14} color="#F08C00" />
                        <Text size="xs">DMARC record missing — this can hurt deliverability. Add it to your DNS provider.</Text>
                      </Group>
                    </Paper>
                  </Card>

                  <Card withBorder radius="md" p="lg" bg="white">
                    <Group justify="space-between" mb="md">
                      <SectionHeader title="Domain Reputation" />
                      <RingProgress size={60} thickness={6} sections={[{ value: 87, color: 'green' }]} label={<Text size="xs" ta="center" fw={700}>87</Text>} />
                    </Group>
                    <Text size="xs" c="dimmed">No blacklist alerts in the last 30 days.</Text>
                  </Card>
                </>
              )}

              {/* ---------------- TEAM ---------------- */}
              {active === 'team' && (
                <Card withBorder radius="md" p="lg" bg="white">
                  <Group justify="space-between" mb="md">
                    <SectionHeader title="Team Members" />
                    <Button leftSection={<IconPlus size={16} />}>Invite member</Button>
                  </Group>
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Member</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {teamMembers.map((m) => (
                        <Table.Tr key={m.email}>
                          <Table.Td>
                            <Group gap={8}>
                              <Avatar size={28} radius="xl" color="indigo">{m.name[0]}</Avatar>
                              <div>
                                <Text size="sm" fw={500}>{m.name}</Text>
                                <Text size="xs" c="dimmed">{m.email}</Text>
                              </div>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Select
                              size="xs"
                              w={130}
                              defaultValue={m.role}
                              data={['Admin', 'Manager', 'Sales Rep', 'Read Only']}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Badge size="sm" variant="light" color={m.status === 'active' ? 'green' : 'yellow'}>
                              {m.status === 'active' ? 'Active' : 'Pending'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon variant="subtle" color="red" size="sm"><IconTrash size={14} /></ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              )}

              {/* ---------------- NOTIFICATIONS ---------------- */}
              {active === 'notifications' && (
                <Card withBorder radius="md" p="lg" bg="white">
                  <SectionHeader title="Notifications" description="Choose what you want to be notified about" />
                  <Divider my="md" />
                  <Stack gap="md">
                    <Switch label="New reply received" description="Get notified by email when a lead replies" defaultChecked />
                    <Switch label="Meeting booked" description="Get notified when a lead books a meeting" defaultChecked />
                    <Switch label="High bounce rate alert" description="Warn me if a campaign's bounce rate goes above 5%" defaultChecked />
                    <Switch label="Weekly summary" description="Receive a performance recap every Monday" />
                    <Divider label="Slack" labelPosition="left" />
                    <Group justify="space-between">
                      <Group gap={8}>
                        <IconBrandSlack size={18} color="#4A154B" />
                        <Text size="sm">Send notifications to Slack</Text>
                      </Group>
                      <Button size="xs" variant="default">Connect Slack</Button>
                    </Group>
                  </Stack>
                </Card>
              )}

              {/* ---------------- INTEGRATIONS ---------------- */}
              {active === 'integrations' && (
                <Card withBorder radius="md" p="lg" bg="white">
                  <SectionHeader title="Integrations" description="Connect your other tools" />
                  <Divider my="md" />
                  <Stack gap="sm">
                    {[
                      { name: 'HubSpot', desc: 'Sync leads and campaign activity', icon: IconPlug, connected: true },
                      { name: 'Google Calendar', desc: 'Auto-create events from booked meetings', icon: IconCalendarEvent, connected: true },
                      { name: 'Slack', desc: 'Get real-time notifications', icon: IconBrandSlack, connected: false },
                      { name: 'Zapier', desc: 'Connect to 5000+ apps', icon: IconWebhook, connected: false },
                      { name: 'Google Workspace', desc: 'Connect mailboxes directly', icon: IconBrandGoogle, connected: true },
                    ].map((integ) => (
                      <Paper key={integ.name} withBorder p="md" radius="md">
                        <Group justify="space-between">
                          <Group gap={10}>
                            <ThemeIcon variant="light" color="gray" size="lg" radius="md">
                              <integ.icon size={18} />
                            </ThemeIcon>
                            <div>
                              <Text size="sm" fw={600}>{integ.name}</Text>
                              <Text size="xs" c="dimmed">{integ.desc}</Text>
                            </div>
                          </Group>
                          <Button size="xs" variant={integ.connected ? 'light' : 'default'} color={integ.connected ? 'green' : 'gray'}>
                            {integ.connected ? 'Connected' : 'Connect'}
                          </Button>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              )}

              {/* ---------------- BILLING ---------------- */}
              {active === 'billing' && (
                <>
                  <Card withBorder radius="md" p="lg" bg="white">
                    <Group justify="space-between" mb="md">
                      <SectionHeader title="Current Plan" />
                      <Badge size="lg" color="indigo" variant="light">Growth Plan</Badge>
                    </Group>
                    <Group grow mb="md">
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed">Leads</Text>
                        <Text size="sm" fw={600}>4,832 / 10,000</Text>
                        <Progress value={48} size={4} mt={6} radius="xl" />
                      </Paper>
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed">Emails / month</Text>
                        <Text size="sm" fw={600}>12,400 / 25,000</Text>
                        <Progress value={50} size={4} mt={6} radius="xl" color="cyan" />
                      </Paper>
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed">Seats</Text>
                        <Text size="sm" fw={600}>4 / 5</Text>
                        <Progress value={80} size={4} mt={6} radius="xl" color="grape" />
                      </Paper>
                    </Group>
                    <Group justify="flex-end">
                      <Button variant="default">Change plan</Button>
                    </Group>
                  </Card>

                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="Payment Method" />
                    <Divider my="md" />
                    <Group justify="space-between">
                      <Group gap={10}>
                        <IconCreditCard size={20} color="#868E96" />
                        <Text size="sm">Visa ending in 4242</Text>
                      </Group>
                      <Button size="xs" variant="default">Update</Button>
                    </Group>
                  </Card>

                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="Billing History" />
                    <Divider my="md" />
                    <Table verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr><Table.Th>Date</Table.Th><Table.Th>Amount</Table.Th><Table.Th>Status</Table.Th><Table.Th></Table.Th></Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {['Jan 1, 2026', 'Dec 1, 2025', 'Nov 1, 2025'].map((date) => (
                          <Table.Tr key={date}>
                            <Table.Td><Text size="sm">{date}</Text></Table.Td>
                            <Table.Td><Text size="sm">$99.00</Text></Table.Td>
                            <Table.Td><Badge size="sm" color="green" variant="light">Paid</Badge></Table.Td>
                            <Table.Td><Button size="compact-xs" variant="subtle">Download</Button></Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Card>
                </>
              )}

              {/* ---------------- CUSTOM FIELDS ---------------- */}
              {active === 'customFields' && (
                <Card withBorder radius="md" p="lg" bg="white">
                  <Group justify="space-between" mb="md">
                    <SectionHeader title="Custom Fields" description="Extra fields available on your leads" />
                    <Button leftSection={<IconPlus size={16} />}>Add field</Button>
                  </Group>
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr><Table.Th>Field name</Table.Th><Table.Th>Type</Table.Th><Table.Th></Table.Th></Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {customFields.map((f) => (
                        <Table.Tr key={f.name}>
                          <Table.Td><Text size="sm">{f.name}</Text></Table.Td>
                          <Table.Td><Badge size="sm" variant="light" color="gray">{f.type}</Badge></Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <ActionIcon variant="subtle" color="gray" size="sm"><IconEdit size={14} /></ActionIcon>
                              <ActionIcon variant="subtle" color="red" size="sm"><IconTrash size={14} /></ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              )}

              {/* ---------------- COMPLIANCE ---------------- */}
              {active === 'compliance' && (
                <Card withBorder radius="md" p="lg" bg="white">
                  <SectionHeader title="Compliance & GDPR" />
                  <Divider my="md" />
                  <Stack gap="md">
                    <Textarea
                      label="Default unsubscribe text"
                      defaultValue="If you'd rather not receive these emails, click here to unsubscribe."
                      autosize
                      minRows={2}
                    />
                    <Switch label="Automatically honor unsubscribe requests across all campaigns" defaultChecked />
                    <Switch label="Require GDPR consent before adding EU leads" defaultChecked />
                    <Divider label="Data requests" labelPosition="left" />
                    <Group justify="space-between">
                      <Text size="sm">Export all lead data</Text>
                      <Button size="xs" variant="default">Request export</Button>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Delete all lead data (right to be forgotten)</Text>
                      <Button size="xs" variant="outline" color="red">Request deletion</Button>
                    </Group>
                  </Stack>
                </Card>
              )}

              {/* ---------------- SECURITY ---------------- */}
              {active === 'security' && (
                <>
                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="Two-Factor Authentication" />
                    <Divider my="md" />
                    <Group justify="space-between">
                      <Text size="sm">Add an extra layer of security to your account</Text>
                      <Switch />
                    </Group>
                  </Card>

                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="API Keys" />
                    <Divider my="md" />
                    <Group justify="space-between" mb="sm">
                      <Group gap={8}>
                        <IconKey size={16} color="#868E96" />
                        <Text size="sm" style={{ fontFamily: 'monospace' }}>sk_live_••••••••••••4f2a</Text>
                      </Group>
                      <Group gap={4}>
                        <CopyButton value="sk_live_xxxxx">
                          {({ copied, copy }) => (
                            <ActionIcon variant="subtle" color={copied ? 'green' : 'gray'} onClick={copy}>
                              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                            </ActionIcon>
                          )}
                        </CopyButton>
                        <ActionIcon variant="subtle" color="red"><IconRefresh size={14} /></ActionIcon>
                      </Group>
                    </Group>
                    <Button size="xs" variant="default" leftSection={<IconPlus size={14} />}>Generate new key</Button>
                  </Card>

                  <Card withBorder radius="md" p="lg" bg="white">
                    <SectionHeader title="Active Sessions" />
                    <Divider my="md" />
                    <Stack gap="sm">
                      {[
                        { device: 'MacBook Pro — Chrome', location: 'Dakar, SN', current: true },
                        { device: 'iPhone 15 — App', location: 'Dakar, SN', current: false },
                      ].map((s) => (
                        <Group key={s.device} justify="space-between">
                          <Group gap={8}>
                            <IconDeviceLaptop size={16} color="#868E96" />
                            <div>
                              <Text size="sm">{s.device}</Text>
                              <Text size="xs" c="dimmed">{s.location}</Text>
                            </div>
                          </Group>
                          {s.current ? (
                            <Badge size="sm" variant="light" color="green">This device</Badge>
                          ) : (
                            <Button size="compact-xs" variant="subtle" color="red">Revoke</Button>
                          )}
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                </>
              )}

            </Stack>
          </div>
        </Group>
      </Stack>
    </div>
  )
}