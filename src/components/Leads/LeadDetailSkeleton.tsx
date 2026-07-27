import { Skeleton, Card, Stack, Group, Grid } from '@mantine/core'

export function LeadDetailSkeleton() {
  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Skeleton height={36} width={150} />

        {/* Header Card */}
        <Card withBorder radius="md" p="lg" bg="white">
          <Grid>
            <Grid.Col span={8}>
              <Group gap="md">
                <Skeleton height={80} width={80} radius="md" />
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Skeleton height={28} width="60%" />
                  <Skeleton height={20} width="40%" />
                  <Group gap="md">
                    <Skeleton height={16} width={200} />
                    <Skeleton height={16} width={150} />
                  </Group>
                </Stack>
              </Group>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack gap="sm" align="flex-end">
                <Group gap="sm">
                  <Skeleton height={36} width={80} />
                  <Skeleton height={36} width={120} />
                </Group>
                <Skeleton height={60} width="100%" />
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Stats Cards */}
        <Grid>
          {[1, 2, 3, 4, 5].map((i) => (
            <Grid.Col key={i} span={2.4}>
              <Card withBorder radius="md" p="md" bg="white">
                <Skeleton height={16} width="60%" mb="xs" />
                <Skeleton height={32} width="40%" />
                <Skeleton height={12} width="80%" mt="xs" />
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Tabs Content */}
        <Card withBorder radius="md" bg="white" p="lg">
          <Group gap="md" mb="lg">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={32} width={100} />
            ))}
          </Group>
          <Stack gap="md">
            <Skeleton height={200} />
            <Skeleton height={150} />
            <Skeleton height={180} />
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
