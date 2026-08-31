import { Skeleton, Card, Group, Stack } from '@mantine/core'

export function DashboardSkeleton() {
  return (
    <div className="p-4 bg-slate-50/10">
      {/* Header Skeleton */}
      <Stack gap="xs" mb="lg">
        <Skeleton height={32} width={250} />
        <Skeleton height={20} width={400} />
      </Stack>

      <div className="flex gap-4">
        {/* Sidebar Skeleton */}
        <div className="w-[200px]">
          <Stack gap="sm">
            <Card withBorder radius="md" p="md">
              <Skeleton height={20} mb="sm" />
              <Skeleton height={60} />
            </Card>
            <Card withBorder radius="md" p="md">
              <Skeleton height={20} mb="sm" />
              <Skeleton height={40} />
              <Skeleton height={8} mt="xs" />
            </Card>
            <Card withBorder radius="md" p="md">
              <Skeleton height={20} mb="sm" />
              <Stack gap="xs">
                <Skeleton height={32} />
                <Skeleton height={32} />
                <Skeleton height={32} />
              </Stack>
            </Card>
          </Stack>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          <div className="flex gap-4">
            <div className="flex-1">
              {/* Top Cards */}
              <div className="flex gap-2 mb-2">
                <Card withBorder radius="md" p="lg" style={{ flex: 1 }}>
                  <Skeleton height={20} mb="md" />
                  <Skeleton height={120} />
                </Card>
                <Card withBorder radius="md" p="lg" style={{ flex: 1 }}>
                  <Skeleton height={20} mb="md" />
                  <Stack gap="xs">
                    <Skeleton height={24} />
                    <Skeleton height={24} />
                    <Skeleton height={24} />
                  </Stack>
                </Card>
              </div>

              {/* Bottom Cards */}
              <div className="flex flex-col gap-2">
                <Card withBorder radius="md" p="lg">
                  <Skeleton height={20} mb="md" />
                  <Stack gap="sm">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Group key={i} justify="space-between">
                        <Skeleton height={40} width="30%" />
                        <Skeleton height={40} width="60%" />
                      </Group>
                    ))}
                  </Stack>
                </Card>

                <Card withBorder radius="md" p="lg">
                  <Skeleton height={20} mb="md" />
                  <Stack gap="sm">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height={60} />
                    ))}
                  </Stack>
                </Card>
              </div>
            </div>

            {/* Right Sidebar Skeleton */}
            <div style={{ width: 280 }}>
              <Card withBorder radius="md" p="lg">
                <Skeleton height={20} mb="md" />
                <Stack gap="sm">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Group key={i} justify="space-between">
                      <Skeleton height={16} width="60%" />
                      <Skeleton height={16} width="30%" />
                    </Group>
                  ))}
                </Stack>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
