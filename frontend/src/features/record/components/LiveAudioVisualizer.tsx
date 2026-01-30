import { MicIcon } from '@/assets'
import { useAudioRecorder } from '@/features/record/hooks/useAudioRecorder'

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
        <button
          type="button"
          onClick={startRecording}
          disabled={isRequestingPermission}
          className="bg-orange-050 flex h-full w-full items-center justify-center gap-2 rounded-[100px] py-3.5 text-orange-500 transition-all duration-300 ease-out active:bg-orange-100 disabled:pointer-events-none disabled:opacity-70"
        >
          <MicIcon className="h-5 w-5 shrink-0" aria-hidden />
          <span className="body-m-semibold">
            {isRequestingPermission ? '마이크 권한 요청 중…' : '음성으로 기록하기'}
          </span>
        </button>
      ) : (
        <div
          role="region"
          aria-label="녹음 중"
          className="flex h-full w-full items-center gap-3 rounded-[100px] bg-gray-900 px-[5px] py-3"
        >
          <div className="flex flex-1 items-center justify-between rounded-[100px] bg-gray-800 px-5 py-1.5">
            <span className="body-m-semibold shrink-0 text-orange-500">{timerText}</span>
            <canvas ref={canvasRef} width={200} height={32} className="h-8 w-full max-w-[120px]" aria-hidden />
          </div>
          <div className="flex shrink-0 gap-4">
            <button type="button" onClick={cancel} className="body-m-semibold text-gray-400">
              취소
            </button>
            <button type="button" onClick={complete} className="body-m-semibold text-orange-500">
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
