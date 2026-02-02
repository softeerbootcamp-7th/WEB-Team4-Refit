import { Outlet } from 'react-router'
import MobileNavbar from '@/shared/MobileNavbar'

export default function MobileLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-gray-100">
      <div className="bg-gray-white flex min-h-dvh w-full max-w-120 flex-col shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
        <MobileNavbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-auto pt-15">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
