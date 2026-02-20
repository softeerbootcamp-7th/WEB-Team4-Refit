import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react'
import { MicIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import { useAudioRecorder } from '@/features/_common/record/components/useAudioRecorder'

type LiveAudioVisualizerProps = {
  onCancel?: () => void
  onComplete?: () => void
  /** STT 연동 시 실시간 인식 결과를 넘길 콜백 */
  onRealtimeTranscript?: Dispatch<SetStateAction<string>>
  uiType: 'mobile' | 'desktop'
  /** 녹음 상태 변경 시 호출될 콜백 */
  onRecordingChange?: (isRecording: boolean) => void
}

export default function LiveAudioVisualizer({
  onCancel,
  onComplete,
  onRealtimeTranscript,
  uiType,
  onRecordingChange,
}: LiveAudioVisualizerProps) {
  const { canvasRef, isRecording, timerText, isAndroid, isRequestingPermission, startRecording, cancel, complete } =
    useAudioRecorder({ onCancel, onComplete, onRealtimeTranscript })

  const isMobile = uiType === 'mobile'

  useEffect(() => {
    onRecordingChange?.(isRecording)
  }, [isRecording, onRecordingChange])

  return (
    <div className={`relative ${isMobile ? 'h-14 w-full' : 'mx-auto w-fit'}`}>
      {!isRecording ? (
        isMobile ? (
          <Button
            onClick={startRecording}
            disabled={isRequestingPermission}
            variant="fill-orange-050"
            radius="full"
            size="md"
            className="w-full"
          >
            <MicIcon className="h-5 w-5 shrink-0" aria-hidden />
            {isRequestingPermission ? '마이크 권한 요청 중…' : '음성으로 기록하기'}
          </Button>
        ) : (
          <button
            onClick={startRecording}
            disabled={isRequestingPermission}
            className="title-s-semibold flex w-full cursor-pointer items-center gap-2 rounded-full bg-orange-100 px-8 py-3 text-orange-500 transition-colors hover:bg-orange-200"
          >
            <MicIcon className="h-5 w-5 shrink-0" aria-hidden />
            {isRequestingPermission ? '마이크 권한 요청 중…' : '음성으로 기록하기'}
          </button>
        )
      ) : (
        <div
          role="region"
          aria-label="녹음 중"
          className={`flex w-full items-center justify-between gap-3 rounded-[100px] bg-gray-900 ${
            isMobile ? 'h-full px-4 py-3' : 'px-8 py-2'
          }`}
        >
          <span className="body-m-semibold shrink-0 text-orange-500 tabular-nums">{timerText}</span>
          <div className="flex min-w-0 flex-1 items-center overflow-hidden px-2">
            {isAndroid ? <StaticRecordingIndicator /> : <DynamicRecordingIndicator canvasRef={canvasRef} />}
          </div>
          <div className="flex shrink-0 gap-4">
            <button type="button" onClick={cancel} className="body-m-semibold cursor-pointer text-gray-400">
              취소
            </button>
            <button type="button" onClick={complete} className="body-m-semibold cursor-pointer text-orange-500">
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type DynamicRecordingIndicatorProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

function DynamicRecordingIndicator({ canvasRef }: DynamicRecordingIndicatorProps) {
  return (
    <div className="flex w-full min-w-0 items-center justify-center rounded-[100px] bg-gray-800 px-5 py-1.5">
      <canvas ref={canvasRef} width={200} height={32} className="h-8 max-w-full min-w-0" aria-hidden />
    </div>
  )
}

function StaticRecordingIndicator() {
  return (
    <div className="flex w-full min-w-0 items-center justify-center rounded-[100px] bg-gray-800 px-5 py-2">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" aria-hidden />
      <span className="caption-l-semibold px-3 tracking-[0.22em] text-orange-500" aria-label="녹음 중">
        REC
      </span>
      <span
        className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500"
        style={{ animationDelay: '350ms' }}
        aria-hidden
      />
    </div>
  )
}
