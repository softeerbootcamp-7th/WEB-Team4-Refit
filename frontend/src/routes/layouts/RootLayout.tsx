import { Outlet } from 'react-router'
import NavBar from '@/shared/NavBar'

export default function RootLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="h-15 shrink-0">
        <NavBar />
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
