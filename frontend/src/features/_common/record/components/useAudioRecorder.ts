import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useAudioVisualizer } from './useAudioVisualizer'
import { useSpeechRecognition } from './useSpeechRecognition'

type UseAudioRecorderOptions = {
  onCancel?: () => void
  onComplete?: () => void
  /** STT 연동 시 실시간 인식 결과를 넘길 콜백 */
  onRealtimeTranscript?: Dispatch<SetStateAction<string>>
}

export function useAudioRecorder({ onCancel, onComplete, onRealtimeTranscript }: UseAudioRecorderOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  const { startRecognition, stopRecognition } = useSpeechRecognition({
    onRealtimeTranscript,
    onRecognitionStatusChange: setIsRecording,
  })

  const isAndroid = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    return /Android/i.test(navigator.userAgent)
  }, [])

  useAudioVisualizer(isAndroid ? null : stream, canvasRef)

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timerText = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  const startRecording = async () => {
    if (isRequestingPermission) return
    setIsRequestingPermission(true)
    try {
      if (!isAndroid) {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = newStream
        setStream(newStream)
      }
      setSeconds(0)
      const isRecognitionStarted = startRecognition()
      if (!isRecognitionStarted) {
        setIsRecording(false)
        return
      }
      setIsRecording(true)
    } catch {
      // 마이크 권한 관련 로직
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const stopAudio = () => {
    stopMediaStream()
    stopRecognition()
    setIsRecording(false)
  }

  const cancel = () => {
    stopAudio()
    onCancel?.()
  }

  const complete = () => {
    stopAudio()
    onComplete?.()
  }

  useEffect(() => {
    if (!isRecording) return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    return () => {
      stopMediaStream()
      stopRecognition()
    }
  }, [stopMediaStream, stopRecognition])

  return {
    canvasRef,
    isRecording,
    seconds,
    timerText,
    isAndroid,
    isRequestingPermission,
    startRecording,
    cancel,
    complete,
  }
}
