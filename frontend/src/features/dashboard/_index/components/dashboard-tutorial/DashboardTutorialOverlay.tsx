import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { RefObject } from 'react'

interface DashboardTutorialOverlayProps {
  bannerRef: RefObject<HTMLDivElement | null>
  calendarRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}

interface SpotlightRect {
  left: number
  top: number
  width: number
  height: number
  radius: number
}

interface TutorialLayout {
  viewportWidth: number
  viewportHeight: number
  banner: SpotlightRect
  calendar: SpotlightRect
}

const HIGHLIGHT_PADDING = 8
const VIEWPORT_PADDING = 24
const BANNER_TEXT_WIDTH = 300
const CALENDAR_TEXT_WIDTH = 332

export default function DashboardTutorialOverlay({ bannerRef, calendarRef, onClose }: DashboardTutorialOverlayProps) {
  const maskId = useId()
  const [layout, setLayout] = useState<TutorialLayout | null>(null)

  const measureLayout = useCallback(() => {
    const bannerElement = bannerRef.current
    const calendarElement = calendarRef.current

    if (!bannerElement || !calendarElement) return

    const bannerRect = bannerElement.getBoundingClientRect()
    const calendarRect = calendarElement.getBoundingClientRect()

    setLayout({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      banner: expandRect(bannerRect, HIGHLIGHT_PADDING, 24),
      calendar: expandRect(calendarRect, HIGHLIGHT_PADDING, 20),
    })
  }, [bannerRef, calendarRef])

  useEffect(() => {
    const bannerElement = bannerRef.current
    const calendarElement = calendarRef.current

    if (!bannerElement || !calendarElement) return

    const rafId = window.requestAnimationFrame(measureLayout)
    const resizeObserver = new ResizeObserver(measureLayout)
    resizeObserver.observe(bannerElement)
    resizeObserver.observe(calendarElement)

    window.addEventListener('resize', measureLayout)
    window.addEventListener('scroll', measureLayout, true)

    return () => {
      window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measureLayout)
      window.removeEventListener('scroll', measureLayout, true)
    }
  }, [measureLayout, bannerRef, calendarRef])

  const guide = useMemo(() => {
    if (!layout) return null

    // --- Banner Guide Calculation ---
    // Start from bottom-right area of banner
    const bannerAnchorX = layout.banner.left + layout.banner.width * 0.1
    const bannerAnchorY = layout.banner.top + layout.banner.height

    const bannerVerticalDrop = 48
    const bannerCurveRadius = 16

    // Path: M start -> L down -> Q curve-right -> L right
    const bannerPath = `
      M ${bannerAnchorX} ${bannerAnchorY} 
      L ${bannerAnchorX} ${bannerAnchorY + bannerVerticalDrop}
      Q ${bannerAnchorX} ${bannerAnchorY + bannerVerticalDrop + bannerCurveRadius} ${bannerAnchorX + bannerCurveRadius} ${bannerAnchorY + bannerVerticalDrop + bannerCurveRadius}
      L ${bannerAnchorX + bannerCurveRadius + 20} ${bannerAnchorY + bannerVerticalDrop + bannerCurveRadius}
    `
    // Text Position: Left aligned (but placed to the right of the line)
    const bannerTextTop = bannerAnchorY + bannerVerticalDrop + bannerCurveRadius - 14
    const bannerTextLeft = bannerAnchorX + bannerCurveRadius + 35

    // --- Calendar Guide Calculation ---
    // Start from left side of calendar, somewhere near middle/bottom
    const calendarAnchorX = layout.calendar.left
    const calendarAnchorY = layout.calendar.top + layout.calendar.height * 0.65

    const calendarHorizontalRun = 40
    const calendarCurveRadius = 16
    const calendarVerticalRun = 32

    // Path: Left -> Turn Down -> Down
    const calendarLineEndY = calendarAnchorY + calendarCurveRadius + calendarVerticalRun

    // Text Position: Right aligned to the vertical line
    const calendarTextLeft = calendarAnchorX - calendarHorizontalRun - calendarCurveRadius - CALENDAR_TEXT_WIDTH - 16
    const calendarTextTop = calendarLineEndY - 20

    const calendarPath = `
      M ${calendarAnchorX} ${calendarAnchorY}
      L ${calendarAnchorX - calendarHorizontalRun} ${calendarAnchorY}
      Q ${calendarAnchorX - calendarHorizontalRun - calendarCurveRadius} ${calendarAnchorY} ${calendarAnchorX - calendarHorizontalRun - calendarCurveRadius} ${calendarAnchorY + calendarCurveRadius}
      L ${calendarAnchorX - calendarHorizontalRun - calendarCurveRadius} ${calendarLineEndY}
    `

    const closeHintLeft = clamp(
      layout.banner.left + layout.banner.width / 2 - 190,
      VIEWPORT_PADDING,
      layout.viewportWidth - 380 - VIEWPORT_PADDING,
    )
    const closeHintTop = clamp(layout.banner.top - 60, 16, layout.banner.top + 12)

    return {
      banner: {
        textLeft: bannerTextLeft,
        textTop: bannerTextTop,
        path: bannerPath,
      },
      calendar: {
        textLeft: calendarTextLeft,
        textTop: calendarTextTop,
        path: calendarPath,
      },
      closeHint: {
        left: closeHintLeft,
        top: closeHintTop,
      },
    }
  }, [layout])

  return (
    <div className="fixed inset-0 z-70 cursor-pointer" role="presentation" aria-hidden="true" onPointerDown={onClose}>
      {layout ? (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${layout.viewportWidth} ${layout.viewportHeight}`}
        >
          <defs>
            <mask id={maskId}>
              <rect x={0} y={0} width={layout.viewportWidth} height={layout.viewportHeight} fill="white" />
              <rect
                x={layout.banner.left}
                y={layout.banner.top}
                width={layout.banner.width}
                height={layout.banner.height}
                rx={layout.banner.radius}
                ry={layout.banner.radius}
                fill="black"
              />
              <rect
                x={layout.calendar.left}
                y={layout.calendar.top}
                width={layout.calendar.width}
                height={layout.calendar.height}
                rx={layout.calendar.radius}
                ry={layout.calendar.radius}
                fill="black"
              />
            </mask>
          </defs>

          <rect
            x={0}
            y={0}
            width={layout.viewportWidth}
            height={layout.viewportHeight}
            fill="rgba(19, 21, 24, 0.74)"
            mask={`url(#${maskId})`}
          />

          <rect
            x={layout.banner.left}
            y={layout.banner.top}
            width={layout.banner.width}
            height={layout.banner.height}
            rx={layout.banner.radius}
            ry={layout.banner.radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.74)"
            strokeWidth={2}
          />
          <rect
            x={layout.calendar.left}
            y={layout.calendar.top}
            width={layout.calendar.width}
            height={layout.calendar.height}
            rx={layout.calendar.radius}
            ry={layout.calendar.radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.74)"
            strokeWidth={2}
          />

          {guide && (
            <>
              {/* Natural curve lines */}
              <path
                d={guide.banner.path}
                stroke="white"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                className="opacity-90"
              />
              <path
                d={guide.calendar.path}
                stroke="white"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                className="opacity-90"
              />
              {/* Dots at start of lines */}
              <circle
                cx={layout.banner.left + layout.banner.width * 0.72}
                cy={layout.banner.top + layout.banner.height}
                r={3}
                fill="white"
              />
              <circle
                cx={layout.calendar.left}
                cy={layout.calendar.top + layout.calendar.height * 0.65}
                r={3}
                fill="white"
              />
            </>
          )}
        </svg>
      ) : (
        <div className="absolute inset-0 bg-gray-900/75" />
      )}

      {guide && (
        <div className="pointer-events-none absolute inset-0 text-white">
          <div
            className="absolute rounded-full bg-black/48 px-5 py-2.5 text-white shadow-[0_8px_20px_rgba(0,0,0,0.24)] backdrop-blur-sm"
            style={{
              left: `${guide.closeHint.left}px`,
              top: `${guide.closeHint.top}px`,
            }}
          >
            <span className="caption-l-semibold">아무 곳이나 클릭하면 튜토리얼이 종료됩니다</span>
          </div>

          <p
            className="title-s-semibold text-left whitespace-pre-line text-white"
            style={{
              width: `${BANNER_TEXT_WIDTH}px`,
              left: `${guide.banner.textLeft}px`,
              top: `${guide.banner.textTop}px`,
              position: 'absolute',
            }}
          >
            {'면접 복기 시작하기 버튼을 눌러\n첫 면접을 기록해 보세요'}
          </p>

          <p
            className="title-s-semibold text-right whitespace-pre-line text-white"
            style={{
              position: 'absolute',
              width: `${CALENDAR_TEXT_WIDTH}px`,
              left: `${guide.calendar.textLeft}px`,
              top: `${guide.calendar.textTop}px`,
            }}
          >
            {'캘린더에 면접 일정을 추가하고,\n복기 리마인드를 받아보세요'}
          </p>
        </div>
      )}
    </div>
  )
}

function expandRect(rect: DOMRect, padding: number, radius: number): SpotlightRect {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    radius,
  }
}

function clamp(value: number, min: number, max: number): number {
  if (min > max) return min
  return Math.min(Math.max(value, min), max)
}
