import { Suspense, useState } from 'react'
import { useParams } from 'react-router'
import { useUpdateRawText } from '@/apis'
import { RecordPageContent } from '@/features/record/_index'
import { useRecordPageData } from '@/features/record/_index/hooks/useRecordPageData'
import SidebarLayoutSkeleton from '@/features/record/confirm/components/SidebarLayoutSkeleton'

export default function RecordPage() {
  return (
    <Suspense fallback={<SidebarLayoutSkeleton />}>
      <RecordPageContentContainer />
    </Suspense>
  )
}

function RecordPageContentContainer() {
  const { interviewId } = useParams<{ interviewId: string }>()
  const [text, setText] = useState('')
  const [realtimeText, setRealtimeText] = useState('')
  const { data } = useRecordPageData(Number(interviewId))
  const { mutate: updateRawText, isPending } = useUpdateRawText()

  const handleRecordComplete = () => {
    if (realtimeText) {
      setText((prev) => prev + ' ' + realtimeText)
      setRealtimeText('')
    }
  }

  const handleRecordCancel = () => {
    setRealtimeText('')
  }

  const handleSave = () => {
    if (!interviewId) return
    updateRawText({
      interviewId: Number(interviewId),
      data: { rawText: text },
    })
  }

  return (
    <RecordPageContent
      interviewInfo={data.interviewInfo}
      text={text}
      realtimeText={realtimeText}
      onTextChange={setText}
      onRealtimeTranscript={setRealtimeText}
      onRecordComplete={handleRecordComplete}
      onRecordCancel={handleRecordCancel}
      onSave={handleSave}
      isSavePending={isPending}
      canSave={Boolean(interviewId)}
    />
  )
}
