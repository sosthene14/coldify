import { CalendarPage } from '#/components/Calendar/Calendar.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/calendar/')({
  component: CalendarPage,
})