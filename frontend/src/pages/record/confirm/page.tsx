import { MOCK_INTERVIEW_INFO_DATA, MOCK_QNA_SET_LIST } from '@/constants/example'
import { useSectionScroll } from '@/features/_common/hooks/useSectionScroll'
import { RecordSection } from '@/features/record/confirm/components/contents/RecordSection'
import { RecordConfirmSidebar } from '@/features/record/confirm/components/sidebar/Sidebar'
import { useQnaList } from '@/features/record/confirm/hooks'

export default function RecordConfirmPage() {
  // TODO: API 연동 시 실제 데이터로 교체
  const interviewInfoItems = MOCK_INTERVIEW_INFO_DATA

  const { qnaList, isAddMode, handleEdit, handleDelete, handleAddSave, startAddMode, cancelAddMode } =
    useQnaList(MOCK_QNA_SET_LIST)

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
