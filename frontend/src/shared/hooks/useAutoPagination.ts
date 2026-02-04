import { useEffect, useState } from 'react'

interface UseAutoPaginationOptions<T> {
  data: T[]
  itemsPerPage: number
  intervalMs?: number
}

export function useAutoPagination<T>({ data, itemsPerPage, intervalMs = 3000 }: UseAutoPaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  useEffect(() => {
    if (totalPages <= 1 || isHovered) return

    const id = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, intervalMs)

    return () => clearInterval(id)
  }, [totalPages, intervalMs, isHovered])

  const currentItems = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const bindHover = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    bindHover,
  }
}
