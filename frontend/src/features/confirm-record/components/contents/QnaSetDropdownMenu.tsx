import { useState } from 'react'
import { CloseIcon, MoreIcon, PencilIcon } from '@/assets'
import { Border } from '@/shared/sidebar/Border'

type QnaSetDropdownMenuProps = {
  onEdit: () => void
  onDelete: () => void
}

export const QnaSetDropdownMenu = ({ onEdit, onDelete }: QnaSetDropdownMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleClickEditButton = () => {
    setMenuOpen(false)
    onEdit()
  }
  const handleClickDeleteButton = () => {
    setMenuOpen(false)
    onDelete()
  }
  return (
    <div className="relative ml-auto">
      <button onClick={() => setMenuOpen((v) => !v)} className="flex h-8 w-8 items-center justify-center">
        <MoreIcon />
      </button>
      {menuOpen && (
        <div className="absolute right-4 z-20 w-48.25 overflow-hidden rounded-2xl bg-white shadow">
          <DropdownButton onClick={handleClickEditButton}>
            <PencilIcon className="h-5 w-5 text-gray-700" />
            수정하기
          </DropdownButton>
          <Border />
          <DropdownButton onClick={handleClickDeleteButton}>
            <CloseIcon className="h-5 w-5 text-gray-700" />
            삭제하기
          </DropdownButton>
        </div>
      )}
    </div>
  )
}

const DropdownButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return (
    <button
      className="body-l-medium flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
