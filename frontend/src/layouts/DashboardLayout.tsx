import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

export default function DashboardLayout() {
  const location = useLocation()

  useLayoutEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    main.scrollTop = 0
  }, [location.pathname, location.search])

  return (
    <div className="mx-auto my-8 w-7xl">
      <Outlet />
    </div>
  )
}
