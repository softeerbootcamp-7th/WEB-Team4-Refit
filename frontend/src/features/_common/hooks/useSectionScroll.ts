import { useCallback, useEffect, useRef, useState } from 'react'

type UseSectionScrollOptions = {
  idPrefix?: string
  threshold?: number
}

type UseSectionScrollReturn = {
  activeIndex: number
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  handleItemClick: (index: number) => void
}

export function useSectionScroll({
  idPrefix = 'section',
  threshold = 0.3,
}: UseSectionScrollOptions = {}): UseSectionScrollReturn {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)
  const visibleIndexSetRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.findIndex((ref) => ref === entry.target)
          if (index !== -1) {
            if (entry.isIntersecting) {
              visibleIndexSetRef.current.add(index)
            } else {
              visibleIndexSetRef.current.delete(index)
            }
          }
        })

        if (visibleIndexSetRef.current.size > 0) {
          setActiveIndex(Math.min(...visibleIndexSetRef.current))
        }
      },
      { root: container, threshold },
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    return () => observerRef.current?.disconnect()
  }, [threshold])

  const initialScrollDoneRef = useRef(false)

  const setRef = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      const prevEl = sectionRefs.current[index]
      if (prevEl) {
        observerRef.current?.unobserve(prevEl)
        visibleIndexSetRef.current.delete(index)
      }
      sectionRefs.current[index] = el
      if (el) {
        el.id = `${idPrefix}-${index + 1}`
        observerRef.current?.observe(el)

        if (!initialScrollDoneRef.current) {
          const hash = window.location.hash
          if (hash === `#${idPrefix}-${index + 1}`) {
            el.scrollIntoView({ block: 'center' })
            initialScrollDoneRef.current = true
          }
        }
      }
    },
    [idPrefix],
  )

  const handleItemClick = useCallback(
    (index: number) => {
      window.history.replaceState(null, '', `#${idPrefix}-${index + 1}`)
      sectionRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
    [idPrefix],
  )

  return { activeIndex, setRef, scrollContainerRef, handleItemClick }
}
