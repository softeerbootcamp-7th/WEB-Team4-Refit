import { useEffect, useRef } from 'react'

const FFT_SIZE = 256
const BAR_COUNT = 20
const BAR_WIDTH = 2
const BAR_COLOR = '#fe6f0f'
const UPDATE_INTERVAL = 50

function calculateRMS(dataArray: Uint8Array): number {
  const sum = dataArray.reduce((acc, value) => {
    const amplitude = value - 128
    return acc + amplitude ** 2
  }, 0)
  return Math.sqrt(sum / dataArray.length)
}

function drawVisualizerBars(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  history: number[],
  barCount: number,
  barWidth: number,
  barColor: string,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const sliceWidth = canvas.width / barCount

  history.forEach((value, i) => {
    const barHeight = Math.min((value / 40) * canvas.height, canvas.height)
    const x = i * sliceWidth + (sliceWidth - barWidth) / 2
    const y = (canvas.height - barHeight) / 2
    ctx.fillStyle = barColor
    ctx.fillRect(x, y, barWidth, barHeight)
  })
}

export function useAudioVisualizer(stream: MediaStream | null, canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const volumeHistoryRef = useRef<number[]>(new Array(BAR_COUNT).fill(0))

  useEffect(() => {
    if (!stream || !canvasRef.current) return

    const audioContext = new window.AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = FFT_SIZE
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    volumeHistoryRef.current = new Array(BAR_COUNT).fill(0)

    let lastUpdateTime = 0

    const draw = (time: number) => {
      if (!analyserRef.current || !canvasRef.current) return

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

      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        drawVisualizerBars(ctx, canvasRef.current, volumeHistoryRef.current, BAR_COUNT, BAR_WIDTH, BAR_COLOR)
      }
      animationFrameRef.current = requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      analyserRef.current = null
    }
  }, [canvasRef, stream])
}
