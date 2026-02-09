import { useAudioRecorder } from '@/features/mobile/_common/hooks/useAudioRecorder'
import { MicIcon } from '@/shared/assets'
import { Button } from '@/shared/components'

type LiveAudioVisualizerProps = {
  onCancel?: () => void
  onComplete?: () => void
  /** STT 연동 시 실시간 인식 결과를 넘길 콜백 */
  onRealtimeTranscript?: (text: string) => void
}

export default function LiveAudioVisualizer({ onCancel, onComplete, onRealtimeTranscript }: LiveAudioVisualizerProps) {
  const { canvasRef, isRecording, timerText, isRequestingPermission, startRecording, cancel, complete } =
    useAudioRecorder({ onCancel, onComplete, onRealtimeTranscript })

  return (
    <div className="relative h-14 w-full">
      {!isRecording ? (
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
        <div
          role="region"
          aria-label="녹음 중"
          className="flex h-full w-full items-center justify-between gap-3 rounded-[100px] bg-gray-900 px-4 py-3"
        >
          <span className="body-m-semibold shrink-0 text-orange-500 tabular-nums">{timerText}</span>
          <div className="flex min-w-0 flex-1 items-center overflow-hidden px-2">
            <div className="flex w-full min-w-0 items-center justify-center rounded-[100px] bg-gray-800 px-5 py-1.5">
              <canvas ref={canvasRef} width={200} height={32} className="h-8 max-w-full min-w-0" aria-hidden />
            </div>
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
