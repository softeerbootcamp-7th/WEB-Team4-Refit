import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div className="mx-auto my-8 w-7xl">
      <Outlet />
    </div>
  )
}
