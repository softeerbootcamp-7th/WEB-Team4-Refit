import { Logo } from '@/ui/assets'

export default function MobileNavbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-15 items-center justify-center">
      <div className="border-gray-150 bg-gray-white mx-auto flex h-full w-full max-w-120 items-center border-b px-6 py-3">
        <Logo className="h-6 w-auto text-orange-500" />
      </div>
    </nav>
  )
}
