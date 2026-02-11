import { Outlet } from 'react-router'
import { Navbar } from '@/designs/components'

export default function RootLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="h-15 shrink-0">
        <Navbar />
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
