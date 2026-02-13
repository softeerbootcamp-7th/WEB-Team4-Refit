export default function MinimizedSidebarLayoutSkeleton() {
  return (
    <div className="grid h-full grid-cols-[80px_1.2fr_1fr] p-6">
      <aside className="bg-gray-150 flex w-14 flex-col items-center gap-4 rounded-xl" />
      <section className="flex flex-col gap-5">
        <div className="bg-gray-150 h-7 w-72 animate-pulse rounded" />
        <div className="flex flex-1 flex-col gap-5 overflow-hidden">
          <div className="bg-gray-white flex h-40 flex-col gap-6 rounded-lg p-5" />
        </div>
      </section>
      <aside className="ml-6 flex flex-col gap-4">
        <div className="bg-gray-150 h-full w-full animate-pulse rounded-xl" />
        <div className="flex shrink-0 justify-end gap-3">
          <div className="bg-gray-150 h-13 w-90 animate-pulse rounded-lg" />
        </div>
      </aside>
    </div>
  )
}
