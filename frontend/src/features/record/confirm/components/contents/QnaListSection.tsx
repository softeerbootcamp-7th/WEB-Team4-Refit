import { useEffect, useRef, useState, type RefObject } from 'react'
import { QnaSetEditForm } from '@/features/_common/_index/components/qna-set'
import { SECTION_SCROLL_OFFSET } from '@/features/_common/_index/hooks/useSectionScroll'
import type { SimpleQnaType } from '@/types/interview'
import { CirclePlusIcon } from '@/ui/assets'
import { Button, FadeScrollArea } from '@/ui/components'
import { QnaSetContainer } from './QnaSetContainer'

type QnaListSectionProps = {
  qnaList: SimpleQnaType[]
  isAddMode: boolean
  isCreating: boolean
  isDeleting: boolean
  onEdit: (qnaSetId: number, question: string, answer: string) => void
  onDelete: (qnaSetId: number) => void
  onAddSave: (question: string, answer: string) => void
  onStartAdd: () => void
  onCancelAdd: () => void
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

export function QnaListSection({
  qnaList,
  isAddMode,
  isCreating,
  isDeleting,
  onEdit,
  onDelete,
  onAddSave,
  onStartAdd,
  onCancelAdd,
  setRef,
  scrollContainerRef,
}: QnaListSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const addFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAddMode) {
      const container = scrollContainerRef.current
      const el = addFormRef.current
      if (container && el)
        requestAnimationFrame(() =>
          container.scrollTo({ top: el.offsetTop - SECTION_SCROLL_OFFSET, behavior: 'smooth' }),
        )
    }
  }, [isAddMode, scrollContainerRef])

  const isOtherEditing = (qnaSetId: number) => isAddMode || (editingId !== null && editingId !== `qna-${qnaSetId}`)
  const isAddDisabled = isCreating || editingId !== null
  const nextIdx = qnaList.length + 1

  return (
    <FadeScrollArea ref={scrollContainerRef} withBottomSpacer className="flex flex-col gap-5 pr-2">
      {qnaList.map((qnaData, idx) => (
        <QnaSetContainer
          key={qnaData.qnaSetId}
          ref={(el) => setRef(idx, el)}
          qnaData={qnaData}
          idx={idx + 1}
          isOtherEditing={isOtherEditing(qnaData.qnaSetId)}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditingIdChange={setEditingId}
        />
      ))}
      {isAddMode ? (
        <div ref={addFormRef} className="rounded-lg border border-gray-300 shadow-md">
          <QnaSetEditForm idx={nextIdx} onSave={onAddSave} onCancel={onCancelAdd} isSaving={isCreating} />
        </div>
      ) : (
        <div className="flex justify-center">
          <Button variant="outline-orange-100" size="sm" radius="full" onClick={onStartAdd} disabled={isAddDisabled}>
            <CirclePlusIcon className={isAddDisabled ? 'text-gray-300' : 'text-orange-500'} />
            질문 추가하기
          </Button>
        </div>
      )}
    </FadeScrollArea>
  )
}
