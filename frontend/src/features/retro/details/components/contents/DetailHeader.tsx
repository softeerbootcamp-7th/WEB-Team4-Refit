import { useNavigate } from 'react-router'
import { ArrowLeftIcon, FileIcon } from '@/designs/assets'
import { Button } from '@/designs/components'

type DetailHeaderProps = {
  title: string
  isPdfOpen: boolean
  onTogglePdf: () => void
}

export function DetailHeader({ title, isPdfOpen, onTogglePdf }: DetailHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <h1 className="title-l-bold line-clamp-1 break-all">{title}</h1>
      <Button variant="outline-gray-150" size="xs" onClick={onTogglePdf} className="caption-l-medium text-gray-600">
        <FileIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">{isPdfOpen ? '닫기' : '자기소개서 열기'}</span>
      </Button>
    </div>
  )
}
