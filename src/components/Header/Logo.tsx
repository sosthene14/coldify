import { Link } from '@tanstack/react-router'

export function Logo() {
  return (
    <Link
      to="/dashboard"
      style={{ 
        textDecoration: 'none', 
        display: 'flex', 
        alignItems: 'center',
        flexShrink: 0
      }}
    >
      <img 
        src="/logo.png" 
        alt="So-mails" 
        style={{ 
          height: '22px', 
          width: 'auto'
        }}
      />
    </Link>
  )
}