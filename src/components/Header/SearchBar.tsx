import { Kbd, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

interface SearchBarProps {
  placeholder?: string
}

export function SearchBar({ placeholder = 'Search leads, campaigns...' }: SearchBarProps) {
  return (
    <TextInput
      placeholder={placeholder}
      radius="sm"
      leftSection={<IconSearch size={16} />}
      rightSection={<Kbd size="xs">⌘K</Kbd>}
      rightSectionWidth={42}
      w={280}
      visibleFrom="sm"
    />
  )
}