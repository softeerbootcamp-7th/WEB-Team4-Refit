import { useEffect, useRef, useState } from 'react'

const FFT_SIZE = 256
const BAR_COUNT = 20
const BAR_WIDTH = 2
const BAR_COLOR = '#fe6f0f'
const UPDATE_INTERVAL = 50 // 밀리세컨드 기준

/**
 * RMS(Root Mean Square)를 계산하여 오디오의 평균 볼륨을 구합니다.
 * @param dataArray Time Domain Data (0~255, 128이 무음)
 */
const calculateRMS = (dataArray: Uint8Array): number => {
  const sum = dataArray.reduce((acc, value) => {
    // 8-bit 오디오 데이터는 0~255 범위이며, 128이 0(무음)에 해당합니다.
    // 128을 빼서 -128~127 범위의 진폭(amplitude)으로 변환합니다.
    const amplitude = value - 128
    return acc + amplitude ** 2
  }, 0)
  return Math.sqrt(sum / dataArray.length)
}

const drawVisualizerBars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, history: number[]) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const sliceWidth = canvas.width / BAR_COUNT

  history.forEach((value, i) => {
    const barHeight = Math.min((value / 40) * canvas.height, canvas.height)

    const x = i * sliceWidth + (sliceWidth - BAR_WIDTH) / 2
    const y = (canvas.height - barHeight) / 2

    ctx.fillStyle = BAR_COLOR
    ctx.fillRect(x, y, BAR_WIDTH, barHeight)
  })
}

type UseAudioRecorderOptions = {
  onCancel?: () => void
  onComplete?: () => void
  /** STT 연동 시 실시간 인식 결과를 넘길 콜백 */
  onRealtimeTranscript?: (text: string) => void
}

type AudioVisualizerRefs = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  audioContextRef: React.RefObject<AudioContext | null>
  analyserRef: React.RefObject<AnalyserNode | null>
  animationFrameRef: React.RefObject<number | null>
  volumeHistoryRef: React.RefObject<number[]>
}

function setupAudioVisualizer(stream: MediaStream, refs: AudioVisualizerRefs): void {
  const audioContext = new window.AudioContext()
  const source = audioContext.createMediaStreamSource(stream)
  const analyser = audioContext.createAnalyser()
  analyser.fftSize = FFT_SIZE
  source.connect(analyser)

  refs.audioContextRef.current = audioContext
  refs.analyserRef.current = analyser
  refs.volumeHistoryRef.current = new Array(BAR_COUNT).fill(0)
  
  let lastUpdateTime = 0

  const draw = (time: number) => {
    const { canvasRef, analyserRef, animationFrameRef, volumeHistoryRef } = refs
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    analyserRef.current.getByteTimeDomainData(dataArray)

    if (time - lastUpdateTime >= UPDATE_INTERVAL) {
      const volume = calculateRMS(dataArray)
      const history = volumeHistoryRef.current
      history.shift()
      history.push(volume)
      lastUpdateTime = time
    }

    if (ctx) {
      drawVisualizerBars(ctx, canvas, volumeHistoryRef.current)
    }
    animationFrameRef.current = requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}

export function useAudioRecorder({ onCancel, onComplete, onRealtimeTranscript }: UseAudioRecorderOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const volumeHistoryRef = useRef<number[]>(new Array(BAR_COUNT).fill(0))
  const streamRef = useRef<MediaStream | null>(null)
  const onRealtimeTranscriptRef = useRef(onRealtimeTranscript)
  onRealtimeTranscriptRef.current = onRealtimeTranscript

  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timerText = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

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
      // 마이크 권한 관련 로직
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
        volumeHistoryRef,
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
