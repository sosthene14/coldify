import { Skeleton, Card, Stack, Group } from '@mantine/core'

export function CampaignsSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      <Group align="flex-start" gap={0} wrap="nowrap">
        {/* Left Sidebar */}
        <div style={{ 
          width: 240, 
          borderRight: '1px solid #E9ECEF',
          minHeight: '100vh',
          padding: '16px'
        }}>
          <Skeleton height={36} mb="lg" />
          <Stack gap="xs">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} height={32} />
            ))}
          </Stack>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <Stack gap="md">
            <Skeleton height={32} width={200} />
            
            {/* Tabs */}
            <Group gap="md">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={32} width={120} />
              ))}
            </Group>

            {/* Filters */}
            <Group gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={36} width={150} />
              ))}
            </Group>

            {/* Table */}
            <Card withBorder radius="md" p="lg" bg="white">
              <Stack gap="md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Group key={i} justify="space-between">
                    <Group gap="sm" style={{ flex: 1 }}>
                      <Skeleton height={36} width={36} circle />
                      <Skeleton height={40} width="70%" />
                    </Group>
                    <Skeleton height={24} width={80} />
                    <Skeleton height={24} width={60} />
                    <Skeleton height={24} width={100} />
                  </Group>
                ))}
              </Stack>
            </Card>
          </Stack>
        </div>
      </Group>
    </div>
  )
}
