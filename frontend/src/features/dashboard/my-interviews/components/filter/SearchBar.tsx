import { useRef, useState, useEffect } from 'react'
import { CloseIcon, SearchIcon } from '@/shared/assets'
import { Button } from '@/shared/components'

type SearchBarProps = {
  keyword: string
  onSearch: (query: string) => void
}

export default function SearchBar({ keyword, onSearch }: SearchBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(keyword.length > 0)
  const [searchQuery, setSearchQuery] = useState(keyword)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsSearchOpen(keyword.length > 0)
    setSearchQuery(keyword)
  }, [keyword])

  const handleSearchOpen = () => {
    setIsSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 0)
  }

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
    onSearch('')
  }

  if (!isSearchOpen) {
    return (
      <Button size="xs" variant="outline-gray-100" onClick={handleSearchOpen}>
        <SearchIcon className="h-4 w-4" />
        검색하기
      </Button>
    )
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        handleSearchSubmit()
      }}
    >
      <input
        ref={searchInputRef}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="body-m-medium bg-gray-white w-full rounded-lg border border-gray-200 px-4 py-1 outline-none placeholder:text-gray-300"
        placeholder="검색어를 입력하세요"
      />
      <Button size="xs" variant="outline-gray-100" type="submit">
        <SearchIcon className="h-4 w-4" />
      </Button>
      <Button size="xs" variant="outline-gray-100" type="button" onClick={handleSearchClose}>
        <CloseIcon className="h-4 w-4" />
      </Button>
    </form>
  )
}
