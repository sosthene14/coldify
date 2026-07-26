import { Group } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import classes from './navLinks.module.css'
import { navItems } from '#/configs/nav.config.ts';
 
export function NavLinks() {
  return (
    <Group gap="lg" wrap="nowrap" visibleFrom="sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={classes.mainLink}
          activeProps={{ 'data-active': true }}
        >
          {item.label}
        </Link>
      ))}
    </Group>
  )
}