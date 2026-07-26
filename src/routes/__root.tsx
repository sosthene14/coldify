import { Outlet, createRootRoute } from '@tanstack/react-router'
import { MantineProvider, createTheme } from '@mantine/core'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { Header } from '../components/Header';

export const Route = createRootRoute({
  component: RootComponent,
})

const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#eaf3ff', '#d3e4ff', '#a5c6ff', '#75a8ff', '#4d8dff',
      '#3b7cf5', '#2e6de0', '#2359c2', '#1a49a3', '#0f3785',
    ],
  },
})

function RootComponent() {
  return (
    <div className="bg-slate-2OO">
    <MantineProvider theme={theme}>
   <Header user={{ name: 'Alex Martin', role: 'Admin' }} notificationCount={3} />

      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
      </MantineProvider>
    </div>
  )
}
