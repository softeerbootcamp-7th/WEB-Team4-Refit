import { Outlet } from 'react-router'
import MobileNavbar from '@/shared/MobileNavbar'

export default function MobileLayout() {
  return (
    <div className="bg-gray-white flex min-h-dvh flex-col">
      <MobileNavbar />
      <main className="flex flex-1 flex-col pt-15">
        <Outlet />
      </main>
    </div>
  )
}
