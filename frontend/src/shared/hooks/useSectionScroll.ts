import { useCallback, useEffect, useRef, useState } from 'react'

type UseSectionScrollOptions = {
  sectionCount: number
  threshold?: number
  scrollDuration?: number
}

type UseSectionScrollReturn = {
  activeIndex: number
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  handleItemClick: (index: number) => void
}

export function useSectionScroll({
  sectionCount,
  threshold = 0.3,
  scrollDuration = 500,
}: UseSectionScrollOptions): UseSectionScrollReturn {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isScrollingByClickRef = useRef(false)

  const setRef = useCallback((index: number, el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el
  }, [])

  const handleItemClick = useCallback(
    (index: number) => {
      isScrollingByClickRef.current = true
      setActiveIndex(index)
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })

      setTimeout(() => {
        isScrollingByClickRef.current = false
      }, scrollDuration)
    },
    [scrollDuration],
  )

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isScrollingByClickRef.current) return

      const containerTop = container.scrollTop
      const containerHeight = container.clientHeight
      const isAtBottom = containerTop + containerHeight >= container.scrollHeight - 10

      if (isAtBottom && sectionCount > 0) {
        setActiveIndex(sectionCount - 1)
        return
      }

      let activeIdx = 0
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const section = sectionRefs.current[i]
        if (section) {
          if (section.offsetTop <= containerTop + containerHeight * threshold) {
            activeIdx = i
          }
        }
      }

      setActiveIndex(activeIdx)
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [sectionCount, threshold])

  return {
    activeIndex,
    setRef,
    scrollContainerRef,
    handleItemClick,
  }
}
