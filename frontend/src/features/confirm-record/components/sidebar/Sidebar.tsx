import { NoteIcon } from '@/assets'
import { SidebarLayout } from '@/shared/sidebar/SidebarLayout'
import { InterviewInfoContainer } from './InterviewInfoContainer'
import { QuestionListContainer } from './QuestionListContainer'

export const RecordConfirmSidebar = () => {
  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewInfoContainer />
      <QuestionListContainer />
    </SidebarLayout>
  )
}
