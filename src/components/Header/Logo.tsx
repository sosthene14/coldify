import { Group, ThemeIcon } from '@mantine/core'
import { IconShieldCheck } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

export function Logo() {
  return (
    <Group
      component={Link}
      gap="xs"
      wrap="nowrap"
      style={{ textDecoration: 'none' }}
    >
      <ThemeIcon size={30} radius="md" variant="filled" color="blue">
        <IconShieldCheck size={18} />
      </ThemeIcon>
 
    </Group>
  )
}