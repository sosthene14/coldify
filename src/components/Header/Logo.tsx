import { Link } from '@tanstack/react-router'

export function Logo() {
  return (
    <Link
      to="/dashboard"
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
    >
      <img 
        src="/logo.png" 
        alt="So-mails" 
        style={{ height: '25px', width: 'auto' }}
      />
    </Link>
  )
}