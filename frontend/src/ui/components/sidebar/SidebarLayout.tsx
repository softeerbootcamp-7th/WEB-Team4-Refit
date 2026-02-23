export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-150 my-6 flex flex-1 overflow-hidden rounded-xl p-6 pb-12">
      <div className="flex w-full flex-col gap-4">{children}</div>
    </div>
  )
}

export const MinimizedSidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="bg-gray-white no-scrollbar my-6.75 flex w-14 flex-1 flex-col items-center gap-4 overflow-y-auto rounded-xl px-1.25 py-3.75">
      {children}
    </aside>
  )
}
