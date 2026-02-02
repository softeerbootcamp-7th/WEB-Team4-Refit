import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'

type FadeScrollAreaProps = PropsWithChildren<{
  className?: string
}>

export default function FadeScrollArea({ children, className = '' }: FadeScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollUp(el.scrollTop > 0)
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateScrollState])

  return (
    <div className="relative flex-1">
      <div
        className={`pointer-events-none absolute top-0 right-0 left-0 z-10 h-12 bg-linear-to-b from-gray-100 to-transparent transition-opacity ${canScrollUp ? 'opacity-100' : 'opacity-0'}`}
      />
      <div ref={scrollRef} onScroll={updateScrollState} className={`absolute inset-0 overflow-y-auto ${className}`}>
        {children}
      </div>
      <div
        className={`pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-linear-to-t from-gray-100 to-transparent transition-opacity ${canScrollDown ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
