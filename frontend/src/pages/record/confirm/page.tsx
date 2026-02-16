import { Suspense } from 'react'
import { useParams } from 'react-router'
import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis/generated/interview-api/interview-api'
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
  const { data } = useGetInterviewFullSuspense(id, { query: { select: transformInterviewData } })

  const { qnaList, isAddMode, handleEdit, handleDelete, handleAddSave, startAddMode, cancelAddMode } = useQnaList(
    data.qnaList,
    { interviewId: id },
  )
  const sectionScroll = useSectionScroll({ idPrefix: 'record-confirm' })

  const questionItems = qnaList.map(({ qnaSetId, questionText }, index) => ({
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
        qnaList={qnaList}
        isAddMode={isAddMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
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

  return { interviewInfo, qnaList }
}
