import { CloseIcon, SearchColorIcon } from '@/ui/assets'
import Button from '@/ui/components/button'

type SearchResultBarProps = {
  query: string
  onClose: () => void
}

export default function SearchResultBar({ query, onClose }: SearchResultBarProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchColorIcon className="h-6 w-6" />
      <span className="title-m-bold">
        <span className="text-orange-500">&apos;{query}&apos;</span> 검색 결과
      </span>
      <Button onClick={onClose} variant="ghost" size="md" className="active:bg-transparent">
        <CloseIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
      </Button>
    </div>
  )
}
