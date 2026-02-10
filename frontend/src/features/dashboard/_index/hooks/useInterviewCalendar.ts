import { useState } from 'react'
import type { EventColor } from '@/features/dashboard/_index/constants/interviewCalendar'

// 면접이 있는 날짜 (key: 'YYYY-M-D')
// EventColor: orange = 기록 안 함(다가오는 면접 포함), gray = 기록 함
const MOCK_EVENTS: Partial<Record<string, EventColor>> = {
  '2026-2-3': 'orange',
  '2026-2-10': 'orange',
  '2026-2-15': 'gray',
}

type CalendarDay = { day: number; isCurrentMonth: boolean }

const createCalendarDay = (day: number, isCurrentMonth: boolean): CalendarDay => ({ day, isCurrentMonth })

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const prevDays = Array.from({ length: startPad }, (_, i) => createCalendarDay(prevMonthDays - startPad + 1 + i, false))
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => createCalendarDay(i + 1, true))
  const nextDaysCount = 42 - prevDays.length - currentDays.length
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => createCalendarDay(i + 1, false))

  return [...prevDays, ...currentDays, ...nextDays]
}

export const useInterviewCalendar = () => {
  const [today] = useState(() => new Date())
  const [viewDate, setViewDate] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))
  const [selectedDate, setSelectedDate] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  }))

  const calendarDays = getCalendarDays(viewDate.year, viewDate.month)
  const monthLabel = `${viewDate.year}년 ${viewDate.month + 1}월`

  const prevMonth = () => {
    setViewDate((d) => (d.month === 0 ? { year: d.year - 1, month: 11 } : { year: d.year, month: d.month - 1 }))
  }
  const nextMonth = () => {
    setViewDate((d) => (d.month === 11 ? { year: d.year + 1, month: 0 } : { year: d.year, month: d.month + 1 }))
  }
  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    setSelectedDate({
      year: viewDate.year,
      month: viewDate.month,
      day,
    })
  }
  const getEventColor = (day: number): EventColor | undefined => {
    const key = `${viewDate.year}-${viewDate.month + 1}-${day}`
    return MOCK_EVENTS[key]
  }

  return {
    today,
    viewDate,
    selectedDate,
    calendarDays,
    monthLabel,
    prevMonth,
    nextMonth,
    handleDateClick,
    getEventColor,
  }
}
