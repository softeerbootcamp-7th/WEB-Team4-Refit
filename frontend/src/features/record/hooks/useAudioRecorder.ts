import { useEffect, useRef, useState } from 'react'

type UseAudioRecorderOptions = {
  onCancel?: () => void
  onComplete?: () => void
  /** STT 연동 시 실시간 인식 결과를 넘길 콜백 */
  onRealtimeTranscript?: (text: string) => void
}

type AudioVisualizerRefs = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  audioContextRef: React.MutableRefObject<AudioContext | null>
  analyserRef: React.MutableRefObject<AnalyserNode | null>
  animationFrameRef: React.MutableRefObject<number | null>
}

function setupAudioVisualizer(stream: MediaStream, refs: AudioVisualizerRefs): void {
  const audioContext = new window.AudioContext()
  const source = audioContext.createMediaStreamSource(stream)
  const analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
  source.connect(analyser)

  refs.audioContextRef.current = audioContext
  refs.analyserRef.current = analyser

  const draw = () => {
    const { canvasRef, analyserRef, animationFrameRef } = refs
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const barWidth = (canvas.width / bufferLength) * 2.5
      const barColor = '#fe6f0f'
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height
        ctx.fillStyle = barColor
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }
    }
    animationFrameRef.current = requestAnimationFrame(draw)
  }
  draw()
}

export function useAudioRecorder({ onCancel, onComplete, onRealtimeTranscript }: UseAudioRecorderOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const onRealtimeTranscriptRef = useRef(onRealtimeTranscript)
  onRealtimeTranscriptRef.current = onRealtimeTranscript

  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  const timerText = `00:${String(seconds).padStart(2, '0')}`

  const stopAudio = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    analyserRef.current = null
  }

  const startRecording = async () => {
    if (isRequestingPermission) return
    setIsRequestingPermission(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setSeconds(0)
      setIsRecording(true)
    } catch {
      // 마이크 권한 허용 팝업
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const cancel = () => {
    stopAudio()
    setIsRecording(false)
    onCancel?.()
  }

  const complete = () => {
    stopAudio()
    setIsRecording(false)
    onComplete?.()
  }

  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    const stream = streamRef.current
    if (stream) {
      setupAudioVisualizer(stream, {
        canvasRef,
        audioContextRef,
        analyserRef,
        animationFrameRef,
      })
    }

    return () => {
      clearInterval(interval)
      stopAudio()
    }
  }, [isRecording])

  return {
    canvasRef,
    isRecording,
    seconds,
    timerText,
    isRequestingPermission,
    startRecording,
    cancel,
    complete,
  }
}
