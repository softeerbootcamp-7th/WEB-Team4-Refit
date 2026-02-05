import { useState } from 'react'

export function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const pageData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const handlePrev = () => setCurrentPage((p) => Math.max(0, p - 1))
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))

  return {
    currentPage,
    totalPages,
    pageData,
    handlePrev,
    handleNext,
    hasPrev: currentPage > 0,
    hasNext: currentPage < totalPages - 1,
  }
}
