type SidebarLayoutProps = {
  isMinimized?: boolean
  children: React.ReactNode
}

export const SidebarLayout = ({ isMinimized = false, children }: SidebarLayoutProps) => {
  return (
    <aside
      className={
        isMinimized
          ? 'bg-gray-white no-scrollbar my-6.75 ml-6 flex w-14 flex-1 flex-col items-center gap-4 overflow-y-auto rounded-xl px-1.25 py-3.75'
          : 'bg-gray-150 no-scrollbar flex w-80 flex-1 flex-col gap-4 overflow-y-auto p-6 pb-12.5'
      }
    >
      {children}
    </aside>
  )
}
