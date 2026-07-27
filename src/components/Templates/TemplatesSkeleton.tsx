import { Skeleton, Card, Stack, Group, Grid } from '@mantine/core'

export function TemplatesSkeleton() {
  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Stack gap="xs">
            <Skeleton height={32} width={200} />
            <Skeleton height={20} width={250} />
          </Stack>
          <Skeleton height={36} width={140} />
        </Group>

        {/* Tabs */}
        <Group gap="md">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={36} width={120} />
          ))}
        </Group>

        {/* Filters */}
        <Group gap="sm">
          <Skeleton height={36} width={300} />
          <Skeleton height={36} width={180} />
          <Skeleton height={36} width={180} />
        </Group>

        {/* Template Cards Grid */}
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid.Col key={i} span={4}>
              <Card withBorder radius="md" p="lg" bg="white" style={{ height: 320 }}>
                <Stack gap="sm" h="100%">
                  <Group justify="space-between">
                    <Skeleton height={20} width={100} />
                    <Skeleton height={20} width={20} />
                  </Group>
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={16} width="60%" />
                  <Skeleton height={60} />
                  <div style={{ marginTop: 'auto' }}>
                    <Skeleton height={16} width="100%" mb="xs" />
                    <Group grow>
                      <Skeleton height={50} />
                      <Skeleton height={50} />
                    </Group>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </div>
  )
}
