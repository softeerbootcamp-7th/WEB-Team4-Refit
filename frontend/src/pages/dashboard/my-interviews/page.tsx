import { useState } from 'react'
import { FileSaveIcon } from '@/designs/assets'
import TabBar from '@/designs/components/tab'
import { InterviewsTab } from '@/features/dashboard/my-interviews/components/interviews'
import QuestionsTab from '@/features/dashboard/my-interviews/components/questions/QuestionsTab'
import { TAB_ITEMS } from '@/features/dashboard/my-interviews/constants/constants'

export default function MyInterviewsPage() {
  const [activeTab, setActiveTab] = useState<'interviews' | 'questions'>('interviews')

  const handleTabChange = (value: string) => {
    if (value !== 'interviews' && value !== 'questions') return
    setActiveTab(value)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2.5">
        <FileSaveIcon />
        <h1 className="title-l-bold">나의 면접을 모아볼까요?</h1>
      </div>
      <div className="relative flex flex-col gap-7">
        <div className="flex flex-1">
          <TabBar items={TAB_ITEMS} activeValue={activeTab} onChange={handleTabChange} />
        </div>
        {activeTab === 'interviews' && <InterviewsTab />}
        {activeTab === 'questions' && <QuestionsTab />}
      </div>
    </div>
  )
}
