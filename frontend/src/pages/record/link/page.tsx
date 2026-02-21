import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router'
import { InterviewDtoInterviewReviewStatus } from '@/apis'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import MinimizedSidebarLayoutSkeleton from '@/features/_common/components/sidebar/MinimizedSidebarLayoutSkeleton'
import { useSectionScroll } from '@/features/_common/hooks/useSectionScroll'
import { PdfSection } from '@/features/record/link/components/pdf-section'
import { QnaListSection } from '@/features/record/link/components/qna-section/QnaListSection'
import { RecordLinkSidebar } from '@/features/record/link/components/sidebar/Sidebar'
import { HighlightProvider } from '@/features/record/link/contexts'
import type { SimpleQnaType } from '@/types/interview'

export default function RecordLinkPage() {
  return (
    <Suspense fallback={<MinimizedSidebarLayoutSkeleton />}>
      <RecordLinkContent />
    </Suspense>
  )
}

function RecordLinkContent() {
  const { interviewId } = useParams()
  const id = Number(interviewId)
  const { data } = useGetInterviewFullSuspense(id, { query: { select: transformInterviewData } })

  const blockedLinkPath = getBlockedLinkPath(id, data.interviewReviewStatus)

  const qnaSetIds = data.qnaList.map((q) => q.qnaSetId)
  const sidebarItems = data.qnaList.map(({ qnaSetId }, index) => ({
    id: qnaSetId,
    label: `${index + 1}번`,
  }))
  const { activeIndex, setRef, scrollContainerRef, handleItemClick } = useSectionScroll({
    idPrefix: 'record-link',
  })

  if (blockedLinkPath) {
    return <Navigate to={blockedLinkPath} replace />
  }

  return (
    <HighlightProvider qnaSetIds={qnaSetIds} hasPdf={data.hasPdfResourceKey}>
      <div className="grid h-full grid-cols-[80px_1.2fr_1fr]">
        <RecordLinkSidebar items={sidebarItems} activeIndex={activeIndex} onItemClick={handleItemClick} />
        <div className="flex h-full flex-col gap-5 overflow-hidden py-6 pl-6">
          <div>
            <h1 className="title-l-bold">면접에서 나온 질문과 자기소개서를 연결해보세요.</h1>
            <p className="body-s-regular mt-1 text-gray-400">
              질문별 '자기소개서 연결하기' 버튼을 누른 후, 오른쪽 자기소개서에서 관련 내용을 드래그하세요.
            </p>
          </div>
          <QnaListSection qnaList={data.qnaList} setRef={setRef} scrollContainerRef={scrollContainerRef} />
        </div>
        <PdfSection />
      </div>
    </HighlightProvider>
  )
}

function transformInterviewData(res: Awaited<ReturnType<typeof getInterviewFull>>) {
  const interviewFull = res.result
  // TODO: 에러 처리
  if (!interviewFull) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

  const qnaList: SimpleQnaType[] = (interviewFull.qnaSets ?? [])
    .filter((qnaSet) => qnaSet.qnaSetId != null)
    .map((qnaSet) => ({
      qnaSetId: qnaSet.qnaSetId as number,
      questionText: qnaSet.questionText ?? '',
      answerText: qnaSet.answerText ?? '',
    }))

  return {
    qnaList,
    hasPdfResourceKey: Boolean(interviewFull.pdfResourceKey),
    interviewReviewStatus: interviewFull.interviewReviewStatus ?? InterviewDtoInterviewReviewStatus.QNA_SET_DRAFT,
  }
}

function getBlockedLinkPath(
  interviewId: number,
  interviewReviewStatus: InterviewDtoInterviewReviewStatus,
): string | null {
  if (interviewReviewStatus === InterviewDtoInterviewReviewStatus.QNA_SET_DRAFT) return null
  return getInterviewNavigationPath(interviewId, interviewReviewStatus)
}
