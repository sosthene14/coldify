import { Skeleton, Card, Stack, Group } from '@mantine/core'

export function LeadsSkeleton() {
  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Stack gap="xs">
            <Skeleton height={32} width={150} />
            <Skeleton height={20} width={300} />
          </Stack>
          <Group gap="sm">
            <Skeleton height={36} width={140} />
            <Skeleton height={36} width={120} />
          </Group>
        </Group>

        {/* Filters */}
        <Group gap="sm">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={36} width={150} />
          ))}
        </Group>

        {/* Table */}
        <Card withBorder radius="md" p="lg" bg="white">
          <Stack gap="md">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Group key={i} gap="md" wrap="nowrap">
                <Skeleton height={36} width={36} circle />
                <Skeleton height={40} style={{ flex: 1 }} />
                <Skeleton height={24} width={100} />
                <Skeleton height={24} width={120} />
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={60} />
              </Group>
            ))}
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
