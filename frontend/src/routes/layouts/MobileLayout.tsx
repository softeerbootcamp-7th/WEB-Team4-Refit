import { Outlet } from 'react-router'
import MobileNavbar from '@/shared/MobileNavbar'

export default function MobileLayout() {
  return (
    <div className="bg-gray-100 flex min-h-dvh flex-col items-center">
      <div
        className="bg-gray-white flex w-full min-h-dvh max-w-[430px] flex-col shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
      >
        <MobileNavbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-auto pt-15">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
