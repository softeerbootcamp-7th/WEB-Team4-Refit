import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router'
import type { InterviewDtoInterviewReviewStatus } from '@/apis'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import SidebarLayoutSkeleton from '@/features/_common/components/sidebar/SidebarLayoutSkeleton'
import { useSectionScroll } from '@/features/_common/hooks/useSectionScroll'
import { RecordSection } from '@/features/record/confirm/components/contents/RecordSection'
import { RecordConfirmSidebar } from '@/features/record/confirm/components/sidebar/Sidebar'
import { useQnaList } from '@/features/record/confirm/hooks/useQnaList'
import type { InterviewInfoType, InterviewType, SimpleQnaType } from '@/types/interview'

export default function RecordConfirmPage() {
  return (
    <Suspense fallback={<SidebarLayoutSkeleton />}>
      <RecordConfirmContent />
    </Suspense>
  )
}

function RecordConfirmContent() {
  const { interviewId } = useParams()
  const id = Number(interviewId)
  const { data } = useGetInterviewFullSuspense(id, {
    query: {
      select: transformInterviewData,
    },
  })
  const blockedConfirmPath = getBlockedConfirmPath(id, data.interviewReviewStatus)

  const {
    isAddMode,
    isCreating,
    isDeleting,
    actionError,
    isDeleteWithHighlightConfirmOpen,
    isDeleteWithHighlightConfirmPending,
    handleEdit,
    handleDelete,
    cancelDeleteWithHighlight,
    confirmDeleteWithHighlight,
    handleAddSave,
    startAddMode,
    cancelAddMode,
  } = useQnaList({ interviewId: id })
  const sectionScroll = useSectionScroll({ idPrefix: 'record-confirm' })

  const questionItems = data.qnaList.map(({ qnaSetId, questionText }, index) => ({
    id: qnaSetId,
    label: `${index + 1}. ${questionText}`,
  }))

  if (blockedConfirmPath) {
    return <Navigate to={blockedConfirmPath} replace />
  }

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <RecordConfirmSidebar
        infoItems={data.interviewInfo}
        questionItems={questionItems}
        activeIndex={sectionScroll.activeIndex}
        onItemClick={sectionScroll.handleItemClick}
      />
      <RecordSection
        qnaList={data.qnaList}
        isAddMode={isAddMode}
        isCreating={isCreating}
        isDeleting={isDeleting}
        actionError={actionError}
        isDeleteWithHighlightConfirmOpen={isDeleteWithHighlightConfirmOpen}
        isDeleteWithHighlightConfirmPending={isDeleteWithHighlightConfirmPending}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCancelDeleteWithHighlight={cancelDeleteWithHighlight}
        onConfirmDeleteWithHighlight={confirmDeleteWithHighlight}
        onAddSave={handleAddSave}
        onStartAdd={startAddMode}
        onCancelAdd={cancelAddMode}
        setRef={sectionScroll.setRef}
        scrollContainerRef={sectionScroll.scrollContainerRef}
      />
    </div>
  )
}

function transformInterviewData(res: Awaited<ReturnType<typeof getInterviewFull>>) {
  const interviewFull = res.result
  // TODO: 에러 처리
  if (!interviewFull) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

  const interviewInfo: InterviewInfoType = {
    company: interviewFull.company ?? '',
    jobRole: interviewFull.jobRole ?? '',
    interviewType: interviewFull.interviewType as InterviewType,
    interviewStartAt: interviewFull.interviewStartAt ?? '',
  }

  const qnaList: SimpleQnaType[] = (interviewFull.qnaSets ?? []).map((qnaSet) => ({
    qnaSetId: qnaSet.qnaSetId!,
    questionText: qnaSet.questionText ?? '',
    answerText: qnaSet.answerText ?? '',
  }))

  return {
    interviewInfo,
    qnaList,
    interviewReviewStatus: (interviewFull.interviewReviewStatus ?? 'NOT_LOGGED') as InterviewDtoInterviewReviewStatus,
  }
}

function getBlockedConfirmPath(interviewId: number, interviewReviewStatus: InterviewDtoInterviewReviewStatus): string | null {
  if (interviewReviewStatus === 'LOG_DRAFT' || interviewReviewStatus === 'QNA_SET_DRAFT') return null
  return getInterviewNavigationPath(interviewId, interviewReviewStatus)
}
