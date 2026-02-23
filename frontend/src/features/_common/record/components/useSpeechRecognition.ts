import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react'

type SpeechRecognitionOptions = Pick<SpeechRecognition, 'continuous' | 'interimResults' | 'lang' | 'maxAlternatives'>
type UseSpeechRecognitionProps = {
  onRealtimeTranscript?: Dispatch<SetStateAction<string>>
  onRecognitionStatusChange?: (isRecognizing: boolean) => void
}

export function useSpeechRecognition({
  onRealtimeTranscript,
  onRecognitionStatusChange,
}: UseSpeechRecognitionProps = {}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const callbackRef = useRef(onRealtimeTranscript)
  const statusCallbackRef = useRef(onRecognitionStatusChange)
  const isStoppedRef = useRef(false)
  const committedTranscriptRef = useRef('')
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)

  useEffect(() => {
    callbackRef.current = onRealtimeTranscript
  }, [onRealtimeTranscript])

  useEffect(() => {
    statusCallbackRef.current = onRecognitionStatusChange
  }, [onRecognitionStatusChange])

  const emitRecognitionStatus = useCallback((isRecognizing: boolean) => {
    statusCallbackRef.current?.(isRecognizing)
  }, [])

  const stopRecognition = useCallback(() => {
    // recognition.stop()은 동기적으로 작동하지만, 그 전에 큐에 들어간 onresult는 막지 못함
    isStoppedRef.current = true
    emitRecognitionStatus(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [emitRecognitionStatus])

  const startRecognition = useCallback(() => {
    // 둘 다 API 스펙 자체는 같은데 이름이 다른 경우가 있어서 fallback 처리
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    if (!SpeechRecognition || recognitionRef.current) return false

    isStoppedRef.current = false
    committedTranscriptRef.current = ''
    callbackRef.current?.('')

    const options: SpeechRecognitionOptions = {
      lang: 'ko-KR',
      continuous: true, // 유저가 말을 안해도 계속 녹음 진행
      interimResults: !isAndroid, // 중간 인식 결과를 실시간으로 받을지 여부(Android는 오동작 이슈로 비활성화)
      maxAlternatives: 1, // 유사 단어 후보 개수
    }

    const recognition = new SpeechRecognition()
    Object.assign(recognition, options)

    recognition.onstart = () => {
      emitRecognitionStatus(true)
    }

    recognition.onresult = (event) => {
      if (isStoppedRef.current) return

      // 결과가 누적 이벤트로 전달될 수 있어서 final/interim을 분리해 조합
      let finalTranscriptDelta = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        const text = result[0]?.transcript ?? ''
        if (!text) continue
        if (result.isFinal) {
          finalTranscriptDelta += text
        } else {
          interimTranscript += text
        }
      }

      if (finalTranscriptDelta) {
        committedTranscriptRef.current += finalTranscriptDelta
      }
      callbackRef.current?.(`${committedTranscriptRef.current}${interimTranscript}`)
    }

    recognition.onerror = (event) => {
      console.error('[STT] onerror:', event.error)
      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed' ||
        event.error === 'audio-capture' ||
        event.error === 'aborted'
      ) {
        emitRecognitionStatus(false)
      }
    }

    recognition.onend = () => {
      recognitionRef.current = null
      emitRecognitionStatus(false)
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
      return true
    } catch {
      recognitionRef.current = null
      emitRecognitionStatus(false)
      return false
    }
  }, [isAndroid, emitRecognitionStatus])

  useEffect(() => {
    return () => {
      stopRecognition()
    }
  }, [stopRecognition])

  return { startRecognition, stopRecognition }
}
