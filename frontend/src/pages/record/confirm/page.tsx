import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { getGetInterviewFullQueryKey, getInterviewFull } from '@/apis/generated/interview-api/interview-api'
import { LoadingSpinner } from '@/designs/assets'
import { useSectionScroll } from '@/features/_common/hooks/useSectionScroll'
import { RecordSection } from '@/features/record/confirm/components/contents/RecordSection'
import { RecordConfirmSidebar } from '@/features/record/confirm/components/sidebar/Sidebar'
import { useQnaList } from '@/features/record/confirm/hooks/useQnaList'
import type { InterviewInfoType, InterviewType, SimpleQnaType } from '@/types/interview'

export default function RecordConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner className="h-10 w-10 animate-spin text-orange-500" />
        </div>
      }
    >
      <RecordConfirmContent />
    </Suspense>
  )
}

function RecordConfirmContent() {
  const { interviewId } = useParams()
  const id = Number(interviewId)
  const { data } = useSuspenseQuery({
    queryKey: getGetInterviewFullQueryKey(id),
    queryFn: () => getInterviewFull(id),
  })
  const interviewFull = data.result!

  const interviewInfoItems: InterviewInfoType = {
    company: interviewFull.company ?? '',
    jobRole: interviewFull.jobRole ?? '',
    interviewType: interviewFull.interviewType as InterviewType,
    interviewStartAt: interviewFull.interviewStartAt ?? '',
  }

  const initialQnaList: SimpleQnaType[] = (interviewFull.qnaSets ?? []).map((q) => ({
    qnaSetId: q.qnaSetId ?? 0,
    questionText: q.questionText ?? '',
    answerText: q.answerText ?? '',
  }))

  const { qnaList, isAddMode, handleEdit, handleDelete, handleAddSave, startAddMode, cancelAddMode } =
    useQnaList(initialQnaList)

  const { activeIndex, setRef, scrollContainerRef, handleItemClick } = useSectionScroll({
    idPrefix: 'record-confirm',
  })

  const questionItems = qnaList.map(({ qnaSetId, questionText }, index) => ({
    id: qnaSetId,
    label: `${index + 1}. ${questionText}`,
  }))

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <RecordConfirmSidebar
        infoItems={interviewInfoItems}
        questionItems={questionItems}
        activeIndex={activeIndex}
        onItemClick={handleItemClick}
      />
      <RecordSection
        qnaList={qnaList}
        isAddMode={isAddMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddSave={handleAddSave}
        onStartAdd={startAddMode}
        onCancelAdd={cancelAddMode}
        setRef={setRef}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  )
}
