import { useState } from 'react'
import LiveAudioVisualizer from '@/features/mobile/_common/components/LiveAudioVisualizer'
import { Button } from '@/shared/components'

const EDIT_PLACEHOLDER = '녹음 내용을 텍스트로 수정할 수 있어요. (추후 음성 인식 결과가 여기에 채워집니다)'

export default function MobileRecordPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [text, setText] = useState('')
  const [realtimeText, setRealtimeText] = useState('')

  const handleRecordComplete = () => {
    setText(realtimeText)
    setStep(2)
  }

  const handleBackToRecord = () => {
    setStep(1)
    setText('')
    setRealtimeText('')
  }

  return (
    <div className="bg-gray-white flex min-h-0 flex-1 flex-col overflow-auto pb-8">
      <header className="bg-gray-white flex shrink-0 items-center px-5 pt-4.5 pb-4">
        <h1 className="title-l-bold text-gray-800">{step === 1 ? '면접 기록하기' : '기록 수정하기'}</h1>
      </header>

      {step === 1 ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 pt-6">
            <div
              className="body-m-regular border-gray-150 min-h-70 w-full overflow-auto rounded-xl border bg-gray-100 px-4 py-4 whitespace-pre-wrap text-gray-800"
              aria-live="polite"
              aria-label="실시간 인식 결과"
            >
              {realtimeText ? (
                realtimeText
              ) : (
                <p className="text-gray-400">아래 버튼을 눌러 음성으로 기록을 시작하세요.</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 px-5 pt-6">
            <LiveAudioVisualizer onComplete={handleRecordComplete} onRealtimeTranscript={setRealtimeText} />
          </div>
        </>
      ) : (
        <>
          <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 pt-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={EDIT_PLACEHOLDER}
              className="body-m-regular border-gray-150 min-h-70 w-full resize-none rounded-xl border bg-gray-100 px-4 py-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              rows={8}
            />
            <button
              type="button"
              onClick={handleBackToRecord}
              className="body-m-regular mt-3 cursor-pointer text-gray-500 underline"
            >
              다시 녹음하기
            </button>
          </div>
          <div className="flex shrink-0 flex-col px-5 pt-6">
            <Button variant="fill-orange-500" size="md" className="w-full cursor-pointer">
              기록 저장하기
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
