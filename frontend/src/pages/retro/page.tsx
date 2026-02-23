import { Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { InterviewDtoInterviewReviewStatus } from '@/apis'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import SidebarLayoutSkeleton from '@/features/_common/_index/components/sidebar/SidebarLayoutSkeleton'
import { RetroPdfPanel } from '@/features/retro/_common/components/pdf-panel/RetroPdfPanel'
import { RetroSection } from '@/features/retro/_index/components/retro-section/RetroSection'
import type { RetroListItem } from '@/features/retro/_index/components/retro-section/types'
import { RetroMinimizedSidebar, RetroSidebar } from '@/features/retro/_index/components/sidebar'
import type { InterviewInfoType, InterviewType } from '@/types/interview'
import { FileIcon } from '@/ui/assets'
import { Button } from '@/ui/components'

const RETRO_HASH_PREFIX = 'retro'

export default function RetroQuestionPage() {
  return (
    <Suspense fallback={<SidebarLayoutSkeleton />}>
      <RetroQuestionContent />
    </Suspense>
  )
}

function RetroQuestionContent() {
  const { interviewId } = useParams()
  const id = Number(interviewId)
  const { data } = useGetInterviewFullSuspense(id, { query: { select: transformInterviewData } })

  const blockedRetroPath = getBlockedRetroPath(id, data.interviewReviewStatus)

  const { interviewInfo, qnaSets, hasPdfResourceKey } = data
  const { companyName, interviewType } = interviewInfo

  const totalCount = qnaSets.length + 1
  const [currentIndex, setCurrentIndex] = useState(() => getIndexFromHash(window.location.hash, totalCount))
  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const saveCurrentStepRef = useRef<() => Promise<void>>(async () => {})

  const isKptStep = currentIndex === qnaSets.length
  const currentItem: RetroListItem | undefined = isKptStep ? undefined : qnaSets[currentIndex]
  const togglePdf = () => setIsPdfOpen((v) => !v)

  useEffect(() => {
    const hash = `#${RETRO_HASH_PREFIX}-${currentIndex + 1}`
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [currentIndex])

  const registerSaveHandler = (saveHandler: () => Promise<void>) => {
    saveCurrentStepRef.current = saveHandler
  }

  const handleIndexChange = async (nextIndex: number) => {
    if (nextIndex === currentIndex || nextIndex < 0 || nextIndex >= totalCount) return
    await saveCurrentStepRef.current()
    setCurrentIndex(nextIndex)
  }

  const interviewTypeLabel = INTERVIEW_TYPE_LABEL[interviewType]
  const title = `${companyName} ${interviewTypeLabel} 회고 작성`

  const sidebarItems = [
    ...qnaSets.map(({ qnaSetId, questionText }, index) => ({
      id: qnaSetId,
      label: `${index + 1}. ${questionText}`,
    })),
    { id: -1, label: `${qnaSets.length + 1}. 최종 KPT 회고` },
  ]

  const minimizedItems = [
    ...qnaSets.map(({ qnaSetId }, index) => ({
      id: qnaSetId,
      label: `${index + 1}번`,
    })),
    { id: -1, label: 'KPT' },
  ]

  const header = (
    <div className="flex items-center gap-3">
      <h1 className="title-l-bold">{title}</h1>
      <Button variant="outline-gray-150" size="xs" onClick={togglePdf} className="caption-l-medium text-gray-600">
        <FileIcon className="h-4 w-4" />
        {isPdfOpen ? '닫기' : '자기소개서 pdf 열기'}
      </Button>
    </div>
  )

  if (blockedRetroPath) {
    return <Navigate to={blockedRetroPath} replace />
  }

  if (!isPdfOpen) {
    return (
      <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
        <RetroSidebar
          interviewInfo={interviewInfo}
          items={sidebarItems}
          activeIndex={currentIndex}
          onItemClick={(nextIndex) => {
            void handleIndexChange(nextIndex)
          }}
        />
        <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
          {header}
          <RetroSection
            interviewId={id}
            currentIndex={currentIndex}
            currentItem={currentItem}
            retroItems={qnaSets}
            isKptStep={isKptStep}
            totalCount={totalCount}
            onIndexChange={handleIndexChange}
            onRegisterSaveHandler={registerSaveHandler}
            initialKptTexts={data.interviewSelfReview}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[80px_1.2fr_1fr]">
      <RetroMinimizedSidebar
        items={minimizedItems}
        activeIndex={currentIndex}
        onItemClick={(nextIndex) => {
          void handleIndexChange(nextIndex)
        }}
      />
      <div className="flex h-full flex-col gap-5 overflow-hidden p-6 pl-0">
        {header}
        <RetroSection
          interviewId={id}
          currentIndex={currentIndex}
          currentItem={currentItem}
          retroItems={qnaSets}
          isKptStep={isKptStep}
          totalCount={totalCount}
          onIndexChange={handleIndexChange}
          onRegisterSaveHandler={registerSaveHandler}
          initialKptTexts={data.interviewSelfReview}
        />
      </div>
      <RetroPdfPanel
        interviewId={id}
        hasPdf={hasPdfResourceKey}
        qnaSetIds={currentItem && currentItem.qnaSetId > 0 ? [currentItem.qnaSetId] : []}
      />
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

  const qnaSets = (interviewFull.qnaSets ?? []).map((q) => ({
    qnaSetId: q.qnaSetId ?? 0,
    questionText: q.questionText ?? '',
    answerText: q.answerText ?? '',
    qnaSetSelfReviewText: q.qnaSetSelfReviewText ?? '',
    isMarkedDifficult: q.isMarkedDifficult ?? false,
    starAnalysis: q.starAnalysis,
  }))

  return {
    interviewInfo,
    qnaSets,
    hasPdfResourceKey: Boolean(interviewFull.pdfResourceKey),
    interviewReviewStatus: interviewFull.interviewReviewStatus ?? InterviewDtoInterviewReviewStatus.SELF_REVIEW_DRAFT,
    interviewSelfReview: {
      keepText: interviewFull.interviewSelfReview?.keepText ?? '',
      problemText: interviewFull.interviewSelfReview?.problemText ?? '',
      tryText: interviewFull.interviewSelfReview?.tryText ?? '',
    },
  }
}

function getBlockedRetroPath(
  interviewId: number,
  interviewReviewStatus: InterviewDtoInterviewReviewStatus,
): string | null {
  if (interviewReviewStatus === InterviewDtoInterviewReviewStatus.SELF_REVIEW_DRAFT) return null
  return getInterviewNavigationPath(interviewId, interviewReviewStatus)
}

function getIndexFromHash(hash: string, totalCount: number) {
  const hashPrefix = `#${RETRO_HASH_PREFIX}-`
  if (!hash.startsWith(hashPrefix)) return 0

  const rawIndex = hash.slice(hashPrefix.length)
  if (rawIndex.length === 0) return 0

  const parsed = Number(rawIndex)
  if (!Number.isInteger(parsed)) return 0
  const zeroBased = parsed - 1
  if (zeroBased < 0 || zeroBased >= totalCount) return 0
  return zeroBased
}
