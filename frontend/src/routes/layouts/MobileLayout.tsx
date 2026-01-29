import { Outlet } from 'react-router'
import MobileNavbar from '@/shared/MobileNavbar'

export default function MobileLayout() {
  return (
    <div className="min-h-screen">
      <MobileNavbar />
      <main className="pt-15">
        <Outlet />
      </main>
    </div>
  )
}
