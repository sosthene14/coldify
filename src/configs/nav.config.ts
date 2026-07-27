import type { NavItem } from "#/types/header.ts";




export const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Campaigns', href: '/dashboard/campaigns' },
  { label: 'Leads', href: '/dashboard/leads' },
  
  { label: 'Templates', href: '/dashboard/templates' },
  { label: 'Reports', href: '/dashboard/reports' },
  { label: 'Inbox', href: '/dashboard/inbox' },
   { label: 'Calendar', href: '/dashboard/calendar' },
  { label: 'Settings', href: '/dashboard/settings' },
]