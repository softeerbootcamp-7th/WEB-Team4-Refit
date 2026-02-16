import { useCallback, useEffect, useState } from 'react'
import type { RefObject } from 'react'

interface MenuPosition {
  top: number
  left: number
}

interface UseMenuPositionParams {
  isOpen: boolean
  triggerRef: RefObject<HTMLElement | null>
  menuRef: RefObject<HTMLElement | null>
}

export function useMenuPosition({ isOpen, triggerRef, menuRef }: UseMenuPositionParams) {
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return

    const triggerRect = trigger.getBoundingClientRect()
    const menuWidth = menu.offsetWidth
    const menuHeight = menu.offsetHeight
    const hasSpaceBelow = window.innerHeight - triggerRect.bottom >= menuHeight + 4
    const top = hasSpaceBelow ? triggerRect.bottom + 4 : Math.max(8, triggerRect.top - menuHeight - 4)
    const left = Math.min(Math.max(8, triggerRect.right - menuWidth), window.innerWidth - menuWidth - 8)

    setMenuPosition({ top, left })
  }, [triggerRef, menuRef])

  useEffect(() => {
    if (!isOpen) return

    const handleReposition = () => updateMenuPosition()

    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
    updateMenuPosition()

    return () => {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [isOpen, updateMenuPosition])

  return {
    menuPosition,
    setMenuPosition,
  }
}
