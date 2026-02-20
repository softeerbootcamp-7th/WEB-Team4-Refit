export default function SidebarLayoutSkeleton() {
  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <div className="bg-gray-150 my-6 flex flex-1 overflow-hidden rounded-xl p-6 pb-12">
        <div className="flex w-full flex-col gap-4">
          <div className="inline-flex gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="bg-gray-white flex w-full flex-1 flex-col gap-0.5 rounded-[10px] px-3.5 py-4">
            <div className="flex flex-col">
              <div className="flex w-full items-center rounded-[10px] px-2.5 py-2.5">
                <div className="bg-gray-150 h-4 w-full animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
        <div className="bg-gray-150 h-7 w-56 animate-pulse rounded" />
        <div className="flex flex-1 flex-col gap-5 overflow-hidden">
          <div className="bg-gray-white flex flex-col gap-6 rounded-lg p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="bg-gray-150 h-6 w-16 animate-pulse rounded" />
                <div className="flex gap-4">
                  <div className="bg-gray-150 h-5 w-5 animate-pulse rounded" />
                  <div className="bg-gray-150 h-5 w-5 animate-pulse rounded" />
                </div>
              </div>
              <div className="bg-gray-150 h-5 w-3/4 animate-pulse rounded" />
              <div className="ml-2 flex gap-4">
                <div className="bg-gray-150 h-4 w-4 shrink-0 animate-pulse rounded" />
                <div className="bg-gray-150 h-4 w-full animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 justify-end gap-3">
          <div className="bg-gray-150 h-10 w-60 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  )
}
