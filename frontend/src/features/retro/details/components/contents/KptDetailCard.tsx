import { useRef, useState, type Ref } from 'react'
import { useUpdateKptSelfReview } from '@/apis/generated/interview-api/interview-api'
import { MoreIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import { useOnClickOutside } from '@/features/_common/hooks/useOnClickOutside'
import { KptWriteCard } from '@/features/retro/_common/components/KptWriteCard'
import type { KptTextsType } from '@/types/interview'

type KptDetailCardProps = {
  ref?: Ref<HTMLDivElement>
  interviewId: number
  kptTexts: KptTextsType
  isOtherEditing?: boolean
  onEditingIdChange?: (editingId: string | null) => void
}

export function KptDetailCard({ ref, interviewId, kptTexts, isOtherEditing, onEditingIdChange }: KptDetailCardProps) {
  const { mutate: updateKptSelfReview } = useUpdateKptSelfReview()

  const [isEditing, setIsEditing] = useState(false)
  const [editedKpt, setEditedKpt] = useState<KptTextsType>(kptTexts)
  const [resetKey, setResetKey] = useState(0)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(menuRef, () => setIsMenuOpen(false))

  const handleStartEdit = () => {
    setIsEditing(true)
    setIsMenuOpen(false)
    onEditingIdChange?.('kpt')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedKpt(kptTexts)
    setResetKey((prev) => prev + 1)
    onEditingIdChange?.(null)
  }

  const handleSave = () => {
    updateKptSelfReview({
      interviewId,
      data: {
        keepText: editedKpt.keepText,
        problemText: editedKpt.problemText,
        tryText: editedKpt.tryText,
      },
    })
    setIsEditing(false)
    onEditingIdChange?.(null)
  }

  const containerClassName = [
    'relative transition-opacity',
    isEditing ? 'rounded-lg border border-gray-300 shadow-md' : '',
    isOtherEditing ? 'pointer-events-none opacity-30' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={containerClassName}>
      <div className="absolute top-5 right-5 z-10 flex gap-2">
        {isEditing ? (
          <>
            <Button size="xs" variant="outline-gray-100" onClick={handleCancel}>
              취소
            </Button>
            <Button size="xs" variant="outline-orange-100" onClick={handleSave}>
              저장
            </Button>
          </>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <MoreIcon className="h-7 w-7" />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 z-10 mt-1 min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5">
                <button
                  onClick={handleStartEdit}
                  className="body-s-medium w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
                >
                  수정하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <KptWriteCard key={resetKey} defaultValue={editedKpt} readOnly={!isEditing} onChange={setEditedKpt} />
    </div>
  )
}
