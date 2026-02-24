import { useRef, useState } from 'react'
import { useOnClickOutside } from '@/features/_common/_index/hooks/useOnClickOutside'
import { FolderIcon, MoreIcon } from '@/ui/assets'

interface FolderListItemProps {
  name: string
  count: number
  isFixed?: boolean
  isSelected?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const FolderListItem = ({
  name,
  isFixed = false,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
}: FolderListItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(menuRef, () => setIsMenuOpen(false))

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen((prev) => !prev)
  }

  const createMenuHandler = (callback?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    callback?.()
  }

  const handleEdit = createMenuHandler(onEdit)
  const handleDelete = createMenuHandler(onDelete)

  return (
    <div
      onClick={onClick}
      className={`group relative flex w-full cursor-pointer items-center justify-between rounded-lg ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-100'} px-3 py-2 transition-colors`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <FolderIcon className={`h-5 w-5 shrink-0 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
        <span className={`body-s-medium truncate ${isSelected ? 'text-orange-500' : 'text-gray-600'}`}>{name}</span>
      </div>

      {!isFixed && (
        <div
          className={`relative shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${
            isMenuOpen ? 'opacity-100' : ''
          }`}
          ref={menuRef}
        >
          <button
            onClick={handleMenuClick}
            className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            aria-label="더보기 메뉴"
          >
            <MoreIcon className="h-6 w-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-full right-0 z-10 mt-1 min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5">
              <button
                onClick={handleEdit}
                className="body-s-medium w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
              >
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="body-s-medium w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FolderListItem
