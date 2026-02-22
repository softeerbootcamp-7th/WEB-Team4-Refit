import { Suspense, useState } from 'react'
import { useParams } from 'react-router'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import SidebarLayoutSkeleton from '@/features/_common/components/sidebar/SidebarLayoutSkeleton'
import { useSectionScroll } from '@/features/_common/hooks/useSectionScroll'
import { RetroPdfPanel } from '@/features/retro/_common/components/pdf-panel/RetroPdfPanel'
import { DetailHeader } from '@/features/retro/details/components/contents/DetailHeader'
import { RetroDetailSection } from '@/features/retro/details/components/contents/RetroDetailSection'
import { DetailMinimizedSidebar } from '@/features/retro/details/components/sidebar/DetailMinimizedSidebar'
import { DetailSidebar } from '@/features/retro/details/components/sidebar/DetailSidebar'
import type { InterviewInfoType, InterviewType, KptTextsType, QnaSetType } from '@/types/interview'

export default function RetroDetailPage() {
  return (
    <Suspense fallback={<SidebarLayoutSkeleton />}>
      <RetroDetailContent />
    </Suspense>
  )
}

function RetroDetailContent() {
  const { interviewId } = useParams()
  const id = Number(interviewId)
  const { data } = useGetInterviewFullSuspense(id, { query: { select: transformInterviewData } })

  const { interviewInfo, interviewResultStatus, qnaSets, interviewSelfReview, hasUploadedPdf } = data
  const { companyName, interviewType } = interviewInfo

  const [isPdfOpen, setIsPdfOpen] = useState(false)

  const { activeIndex, setRef, scrollContainerRef, handleItemClick } = useSectionScroll({ idPrefix: 'retro' })

  const togglePdf = () => setIsPdfOpen((v) => !v)

  const interviewTypeLabel = INTERVIEW_TYPE_LABEL[interviewType]
  const title = `${companyName} ${interviewTypeLabel} 회고 상세 보기`

  if (isPdfOpen) {
    return (
      <div className="mx-auto grid h-full w-7xl grid-cols-[80px_1.2fr_1fr]">
        <DetailMinimizedSidebar qnaSets={qnaSets} activeIndex={activeIndex} onItemClick={handleItemClick} />
        <div className="flex h-full flex-col gap-5 overflow-hidden p-6 pl-0">
          <DetailHeader title={title} isPdfOpen={isPdfOpen} onTogglePdf={togglePdf} />
          <RetroDetailSection
            interviewId={id}
            qnaSets={qnaSets}
            kptTexts={interviewSelfReview}
            setRef={setRef}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
        <RetroPdfPanel interviewId={id} hasPdf={hasUploadedPdf} qnaSetIds={qnaSets.map((qna) => qna.qnaSetId)} />
      </div>
    )
  }

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <DetailSidebar
        interviewId={id}
        interviewInfo={interviewInfo}
        interviewResultStatus={interviewResultStatus}
        qnaSets={qnaSets}
        activeIndex={activeIndex}
        onItemClick={handleItemClick}
      />
      <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
        <DetailHeader title={title} isPdfOpen={isPdfOpen} onTogglePdf={togglePdf} />
        <RetroDetailSection
          interviewId={id}
          qnaSets={qnaSets}
          kptTexts={interviewSelfReview}
          setRef={setRef}
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </div>
  )
}

function transformInterviewData(res: Awaited<ReturnType<typeof getInterviewFull>>) {
  const interviewFull = res.result
  if (!interviewFull) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

  const interviewInfo: InterviewInfoType = {
    companyName: interviewFull.companyName ?? '',
    jobRole: interviewFull.jobRole ?? '',
    interviewType: interviewFull.interviewType as InterviewType,
    interviewStartAt: interviewFull.interviewStartAt ?? '',
  }

  const qnaSets: QnaSetType[] = (interviewFull.qnaSets ?? []).map((q) => ({
    qnaSetId: q.qnaSetId ?? 0,
    interviewId: interviewFull.interviewId ?? 0,
    questionText: q.questionText ?? '',
    answerText: q.answerText ?? '',
    qnaSetSelfReviewText: q.qnaSetSelfReviewText ?? '',
    isMarkedDifficult: q.isMarkedDifficult ?? false,
    starAnalysis: q.starAnalysis,
  }))

  const interviewSelfReview: KptTextsType = {
    keepText: interviewFull.interviewSelfReview?.keepText ?? '',
    problemText: interviewFull.interviewSelfReview?.problemText ?? '',
    tryText: interviewFull.interviewSelfReview?.tryText ?? '',
  }

  const interviewResultStatus = interviewFull.interviewResultStatus ?? 'WAIT'

  return {
    interviewId: interviewFull.interviewId ?? 0,
    interviewInfo,
    interviewResultStatus,
    qnaSets,
    interviewSelfReview,
    hasUploadedPdf: Boolean(interviewFull.pdfResourceKey),
  }
}
