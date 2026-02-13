import { Suspense, useState } from 'react'
import { useParams } from 'react-router'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
import type { RetroListItem } from '@/constants/example'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { FileIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import SidebarLayoutSkeleton from '@/features/_common/components/sidebar/SidebarLayoutSkeleton'
import { RetroPdfPanel } from '@/features/retro/_index/components/pdf-panel/RetroPdfPanel'
import { RetroSection } from '@/features/retro/_index/components/retro-section/RetroSection'
import { RetroMinimizedSidebar, RetroSidebar } from '@/features/retro/_index/components/sidebar'
import type { InterviewInfoType, InterviewType } from '@/types/interview'

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

  const { interviewInfo, retroList } = data
  const { company, interviewType } = interviewInfo

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPdfOpen, setIsPdfOpen] = useState(false)

  const kptItem: RetroListItem = { qnaSetId: -1, questionText: '최종 KPT 회고', answerText: '', isKpt: true }
  const totalCount = retroList.length + 1
  const currentItem: RetroListItem = currentIndex < retroList.length ? retroList[currentIndex] : kptItem
  const togglePdf = () => setIsPdfOpen((v) => !v)

  const interviewTypeLabel = INTERVIEW_TYPE_LABEL[interviewType as keyof typeof INTERVIEW_TYPE_LABEL]
  const title = `${company} ${interviewTypeLabel} 회고 작성`

  const sidebarItems = [
    ...retroList.map(({ qnaSetId, questionText }, index) => ({
      id: qnaSetId,
      label: `${index + 1}. ${questionText}`,
    })),
    { id: -1, label: `${retroList.length + 1}. 최종 KPT 회고` },
  ]

  const minimizedItems = [
    ...retroList.map(({ qnaSetId }, index) => ({
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

  if (!isPdfOpen) {
    return (
      <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
        <RetroSidebar
          interviewInfo={interviewInfo}
          items={sidebarItems}
          activeIndex={currentIndex}
          onItemClick={setCurrentIndex}
        />
        <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
          {header}
          <RetroSection
            currentIndex={currentIndex}
            currentItem={currentItem}
            totalCount={totalCount}
            onIndexChange={setCurrentIndex}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-[80px_1fr_1fr]">
      <RetroMinimizedSidebar items={minimizedItems} activeIndex={currentIndex} onItemClick={setCurrentIndex} />
      <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
        {header}
        <RetroSection
          currentIndex={currentIndex}
          currentItem={currentItem}
          totalCount={totalCount}
          onIndexChange={setCurrentIndex}
        />
      </div>
      <RetroPdfPanel />
    </div>
  )
}

function transformInterviewData(res: Awaited<ReturnType<typeof getInterviewFull>>) {
  const interviewFull = res.result
  if (!interviewFull) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

  const interviewInfo: InterviewInfoType = {
    company: interviewFull.company ?? '',
    jobRole: interviewFull.jobRole ?? '',
    interviewType: interviewFull.interviewType as InterviewType,
    interviewStartAt: interviewFull.interviewStartAt ?? '',
  }

  const retroList = (interviewFull.qnaSets ?? []).map((q) => ({
    qnaSetId: q.qnaSetId ?? 0,
    questionText: q.questionText ?? '',
    answerText: q.answerText ?? '',
  }))

  return { interviewInfo, retroList }
}
