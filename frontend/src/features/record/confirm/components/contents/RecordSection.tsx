import type { RefObject } from 'react'
import { Button } from '@/designs/components'
import { useInterviewNavigate } from '@/features/_common/hooks/useInterviewNavigation'
import { ROUTES } from '@/routes/routes'
import type { SimpleQnaType } from '@/types/interview'
import { QnaListSection } from './QnaListSection'

type RecordSectionProps = {
  qnaList: SimpleQnaType[]
  isAddMode: boolean
  isCreating: boolean
  isDeleting: boolean
  actionError: string | null
  onEdit: (qnaSetId: number, question: string, answer: string) => void
  onDelete: (qnaSetId: number) => void
  onAddSave: (question: string, answer: string) => void
  onStartAdd: () => void
  onCancelAdd: () => void
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

export function RecordSection({
  qnaList,
  isAddMode,
  isCreating,
  isDeleting,
  actionError,
  onEdit,
  onDelete,
  onAddSave,
  onStartAdd,
  onCancelAdd,
  setRef,
  scrollContainerRef,
}: RecordSectionProps) {
  const navigateWithId = useInterviewNavigate()
  const goToRecordLinkPage = () => navigateWithId(ROUTES.RECORD_LINK)

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
      <h1 className="title-l-bold">작성 내용을 확인해주세요.</h1>
      <QnaListSection
        qnaList={qnaList}
        isAddMode={isAddMode}
        isCreating={isCreating}
        isDeleting={isDeleting}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddSave={onAddSave}
        onStartAdd={onStartAdd}
        onCancelAdd={onCancelAdd}
        setRef={setRef}
        scrollContainerRef={scrollContainerRef}
      />
      {actionError ? <p className="body-s-medium text-red-400">{actionError}</p> : null}
      <div className="flex shrink-0 justify-end gap-3">
        <Button variant="fill-orange-500" size="md" className="w-60" onClick={goToRecordLinkPage}>
          다음 단계
        </Button>
      </div>
    </div>
  )
}
