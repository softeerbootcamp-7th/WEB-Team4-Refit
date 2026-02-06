import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div className="mx-auto mt-7 w-6xl">
      <Outlet />
    </div>
  )
}
