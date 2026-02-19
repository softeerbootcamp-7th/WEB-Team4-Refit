import type { RefObject } from 'react'
import { Button } from '@/designs/components'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
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
  isDeleteWithHighlightConfirmOpen: boolean
  isDeleteWithHighlightConfirmPending: boolean
  onEdit: (qnaSetId: number, question: string, answer: string) => void
  onDelete: (qnaSetId: number) => void
  onCancelDeleteWithHighlight: () => void
  onConfirmDeleteWithHighlight: () => void
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
  isDeleteWithHighlightConfirmOpen,
  isDeleteWithHighlightConfirmPending,
  onEdit,
  onDelete,
  onCancelDeleteWithHighlight,
  onConfirmDeleteWithHighlight,
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
      <ConfirmModal
        open={isDeleteWithHighlightConfirmOpen}
        onClose={onCancelDeleteWithHighlight}
        title={`자기소개서 하이라이트\n연결 정보가 존재하는 항목입니다.\n정말 삭제하시겠습니까?`}
        hasCancelButton={true}
        cancelText="취소"
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isDeleteWithHighlightConfirmPending}
        onOk={onConfirmDeleteWithHighlight}
      />
    </div>
  )
}
