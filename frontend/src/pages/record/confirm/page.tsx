import { Navigate, useParams } from 'react-router'
import { getInterviewFull, InterviewDtoInterviewReviewStatus, useGetInterviewFull } from '@/apis'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import SidebarLayoutSkeleton from '@/features/_common/components/sidebar/SidebarLayoutSkeleton'
import { useInterviewNavigate } from '@/features/_common/hooks/useInterviewNavigation'
import { useSectionScroll } from '@/features/_common/hooks/useSectionScroll'
import LoadingOverlay from '@/features/_common/loading/LoadingOverlay'
import { RecordSection } from '@/features/record/confirm/components/contents/RecordSection'
import { RecordConfirmSidebar } from '@/features/record/confirm/components/sidebar/Sidebar'
import { useQnaList, useRecordConfirmConvertGate } from '@/features/record/confirm/hooks'
import { CONVERT_FAILED_ERROR_CODE } from '@/features/record/confirm/hooks/useRecordConfirmConvertGate'
import { ROUTES } from '@/routes/routes'
import type { InterviewInfoType, InterviewType, SimpleQnaType } from '@/types/interview'

export default function RecordConfirmPage() {
  const { interviewId } = useParams()
  const id = Number(interviewId)
  const navigateWithId = useInterviewNavigate()

  const {
    state: convertGateState,
    failureCode,
    refetchConvertResult,
  } = useRecordConfirmConvertGate({ interviewId: id })

  const {
    data,
    isPending: isInterviewPending,
    isError: isInterviewError,
    refetch: refetchInterviewFull,
  } = useGetInterviewFull(id, {
    query: {
      enabled: convertGateState === 'ready',
      retry: false,
      select: transformInterviewData,
    },
  })

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
  const goToRecordPage = () => navigateWithId(ROUTES.RECORD, { replace: true })

  if (convertGateState === 'failed') {
    return (
      <ConfirmModal
        open={true}
        onClose={goToRecordPage}
        onOk={goToRecordPage}
        title="질문/답변 변환에 실패했어요"
        description={
          failureCode === CONVERT_FAILED_ERROR_CODE
            ? '기록 화면으로 돌아가 내용을 확인한 뒤 다시 시도해 주세요.'
            : '변환을 진행할 수 없는 상태예요.\n기록 화면으로 이동할게요.'
        }
        okText="확인"
        okButtonVariant="fill-gray-800"
        hasCancelButton={false}
      />
    )
  }

  if (convertGateState === 'loading' || (convertGateState === 'ready' && isInterviewPending)) {
    return (
      <>
        <SidebarLayoutSkeleton />
        <LoadingOverlay
          text={
            <>
              작성해주신 내용을 질문과 답변으로
              <br />
              정리하고 있어요!
            </>
          }
        />
      </>
    )
  }

  if (convertGateState === 'error' || isInterviewError || !data) {
    return (
      <ConfirmModal
        open={true}
        onClose={goToRecordPage}
        title="데이터를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        hasCancelButton={true}
        cancelText="기록으로 이동"
        okText="다시 확인"
        okButtonVariant="fill-gray-800"
        onOk={() => {
          if (convertGateState === 'error') {
            void refetchConvertResult()
            return
          }
          void refetchInterviewFull()
        }}
      />
    )
  }

  const blockedConfirmPath = getBlockedConfirmPath(id, data.interviewReviewStatus)

  if (blockedConfirmPath) {
    return <Navigate to={blockedConfirmPath} replace />
  }

  const onAddSave = async (question: string, answer: string) => {
    const newIndex = data.qnaList.length
    await handleAddSave(question, answer)
    window.history.replaceState(null, '', `#record-confirm-${newIndex + 1}`)
  }

  const questionItems = data.qnaList.map(({ qnaSetId, questionText }, index) => ({
    id: qnaSetId,
    label: `${index + 1}. ${questionText}`,
  }))

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
        onAddSave={onAddSave}
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
    companyName: interviewFull.companyName ?? '',
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
    interviewReviewStatus: interviewFull.interviewReviewStatus ?? InterviewDtoInterviewReviewStatus.QNA_SET_DRAFT,
  }
}

function getBlockedConfirmPath(
  interviewId: number,
  interviewReviewStatus: InterviewDtoInterviewReviewStatus,
): string | null {
  if (interviewReviewStatus === InterviewDtoInterviewReviewStatus.QNA_SET_DRAFT) return null
  return getInterviewNavigationPath(interviewId, interviewReviewStatus)
}
