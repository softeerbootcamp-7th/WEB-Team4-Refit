import { Logo } from '@/assets'

export default function MobileNavbar() {
  return (
    <nav className="bg-gray-white fixed top-0 right-0 left-0 z-50 flex h-15 items-center px-6 py-3">
      <Logo className="h-6 w-auto" />
    </nav>
  )
}
