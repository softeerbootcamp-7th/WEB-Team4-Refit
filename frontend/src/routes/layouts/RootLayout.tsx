import { Outlet } from 'react-router'
import NavBar from '@/shared/NavBar'

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-15">
        <Outlet />
      </main>
    </div>
  )
}
