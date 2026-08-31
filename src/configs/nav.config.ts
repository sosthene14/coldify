import type { NavItem } from "#/types/header.ts";




// nav.config.ts
export const navItems: NavItem[] = [
  { label: 'overview', href: '/dashboard' },
  { label: 'emails', href: '/dashboard/mails' },
  { label: 'templates', href: '/dashboard/templates' },
  { label: 'settings', href: '/dashboard/settings' },
]