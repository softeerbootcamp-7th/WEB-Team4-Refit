import { Suspense } from 'react'
import { useParams } from 'react-router'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
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
  const { data } = useGetInterviewFullSuspense(Number(interviewId), { query: { select: transformInterviewData } })

  const qnaSetIds = data.qnaList.map((q) => q.qnaSetId)
  const sidebarItems = data.qnaList.map(({ qnaSetId }, index) => ({
    id: qnaSetId,
    label: `${index + 1}번`,
  }))
  const { activeIndex, setRef, scrollContainerRef, handleItemClick } = useSectionScroll({
    idPrefix: 'record-link',
  })

  return (
    <HighlightProvider qnaSetIds={qnaSetIds}>
      <div className="grid h-full grid-cols-[80px_1.2fr_1fr]">
        <RecordLinkSidebar items={sidebarItems} activeIndex={activeIndex} onItemClick={handleItemClick} />
        <div className="flex h-full flex-col gap-5 overflow-hidden py-6 pl-6">
          <h1 className="title-l-bold">면접에서 나온 질문과 자기소개서를 연결해보세요.</h1>
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

  return { qnaList }
}
