import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div className="mx-auto my-8 w-6xl">
      <Outlet />
    </div>
  )
}
