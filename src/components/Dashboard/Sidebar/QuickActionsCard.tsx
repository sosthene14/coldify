import { quickActions } from '#/configs/quickActions.config.ts';
import { Group, Paper, Stack, Text, UnstyledButton } from '@mantine/core'
 
interface QuickActionsCardProps {
  onAction?: (key: string) => void
}

export function QuickActionsCard({ onAction }: QuickActionsCardProps) {
  return (
    <Paper withBorder radius="sm" p="sm">
      <Text size="sm" fw={600} mb="sm">
        Quick actions
      </Text>

    <Stack gap={8}>
  {quickActions.map((action) => (
    <UnstyledButton
      key={action.key}
      onClick={() => onAction?.(action.key)}
      className="
        group
        rounded-md
        px-2
        py-2
        transition-all
        duration-200
        hover:bg-gray-100
        hover:translate-x-1
        active:scale-[0.98]
      "
    >
      <Group gap={8}>
        <div
          className="
            transition-transform
            duration-200
            group-hover:scale-110
            group-hover:rotate-6
          "
        >
          <action.icon
            size={16}
            color="var(--mantine-color-gray-6)"
          />
        </div>

        <Text
          size="sm"
          c="dark.6"
          className="
            transition-colors
            duration-200
            group-hover:text-black
          "
        >
          {action.label}
        </Text>
      </Group>
    </UnstyledButton>
  ))}
</Stack>
    </Paper>
  )
}