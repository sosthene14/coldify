import { Button } from '@mantine/core'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.29v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.29a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  )
}

type GoogleButtonProps = {
  label: string
  onClick?: () => void
  loading?: boolean
}

export function GoogleButton({ label, onClick, loading }: GoogleButtonProps) {
  return (
    <Button
      variant="default"
      color="gray"
      fullWidth
      leftSection={<GoogleIcon />}
      onClick={onClick}
      loading={loading}
      styles={{
        root: { borderColor: 'var(--mantine-color-gray-3)' },
      }}
    >
      {label}
    </Button>
  )
}