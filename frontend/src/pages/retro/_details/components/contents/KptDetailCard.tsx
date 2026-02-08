import { useState, type Ref } from 'react'
import { useParams } from 'react-router'
import { KptWriteCard } from '@/pages/retro/_index/components/retro-section/KptWriteCard'
import { Button } from '@/shared/components'
import { MOCK_KPT_DATA } from '../../example'

type KptDetailCardProps = {
  ref?: Ref<HTMLDivElement>
  isOtherEditing?: boolean
  onEditingIdChange?: (editingId: string | null) => void
}

export function KptDetailCard({ ref, isOtherEditing, onEditingIdChange }: KptDetailCardProps) {
  const { interviewId } = useParams<{ interviewId: string }>()
  const kptData = MOCK_KPT_DATA

  const [isEditing, setIsEditing] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleEdit = () => {
    setIsEditing(true)
    onEditingIdChange?.('kpt')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setResetKey((k) => k + 1)
    onEditingIdChange?.(null)
  }

  const handleSave = () => {
    setIsEditing(false)
    onEditingIdChange?.(null)
    console.log(interviewId)
  }

  return (
    <div
      ref={ref}
      className={`relative transition-opacity ${
        isEditing ? 'rounded-lg border border-gray-300 shadow-md' : ''
      } ${isOtherEditing ? 'pointer-events-none opacity-30' : ''}`}
    >
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
          <Button size="xs" variant="fill-gray-150" onClick={handleEdit}>
            수정
          </Button>
        )}
      </div>
      <KptWriteCard key={resetKey} defaultValue={kptData} readOnly={!isEditing} />
    </div>
  )
}
