import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react'

type SpeechRecognitionOptions = Pick<SpeechRecognition, 'continuous' | 'interimResults' | 'lang' | 'maxAlternatives'>
type UseSpeechRecognitionProps = {
  onRealtimeTranscript?: Dispatch<SetStateAction<string>>
}

export function useSpeechRecognition({ onRealtimeTranscript }: UseSpeechRecognitionProps = {}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const callbackRef = useRef(onRealtimeTranscript)
  const isStoppedRef = useRef(false)

  useEffect(() => {
    callbackRef.current = onRealtimeTranscript
  }, [onRealtimeTranscript])

  const stopRecognition = useCallback(() => {
    /* recognition.stop()은 동기적으로 작동하지만, 그 전에 큐에 들어간 onresult는 막지 못함 */
    isStoppedRef.current = true
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [])

  const startRecognition = useCallback(() => {
    /* 둘 다 API 스펙 자체는 같은데 이름이 다른 경우가 있어서 그에 대한 fallback 처리 */
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    if (recognitionRef.current) return

    const options: SpeechRecognitionOptions = {
      lang: 'ko-KR',
      continuous: true, // 유저가 말을 안해도 계속 녹음 진행
      interimResults: true, // 실시간 결과 반환
      maxAlternatives: 1, // 유사 단어 후보 개수,
    }
    const recognition = new SpeechRecognition()
    Object.assign(recognition, options)

    /* 결과 나올 때마다 콜백 실행됨 */
    recognition.onresult = (event) => {
      if (isStoppedRef.current) return

      /* continuous; true 이기 때문에 녹음 시작부터의 모든 event가 누적되어서 나옴 */
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('')

      callbackRef.current?.(transcript)
    }

    isStoppedRef.current = false
    recognition.start()
    recognitionRef.current = recognition
  }, [])

  useEffect(() => {
    return () => {
      stopRecognition()
    }
  }, [stopRecognition])

  return { startRecognition, stopRecognition }
}
