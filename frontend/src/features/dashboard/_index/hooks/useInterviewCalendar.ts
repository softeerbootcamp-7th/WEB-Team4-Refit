import { useMemo, useState } from 'react'
import { useGetDashboardCalendarInterviews } from '@/apis'
import type { InterviewDto } from '@/apis'
import type { EventColor } from '@/features/dashboard/_index/constants/interviewCalendar'

type CalendarDay = { day: number; isCurrentMonth: boolean }
type CalendarDateEntry = {
  year: number
  month: number
  day: number
  dDay: number
  interviews: InterviewDto[]
}

export interface CalendarInterviewItem {
  dDay: number
  interview: InterviewDto
}

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

function parseCalendarDate(date: string) {
  const [year, month, day] = date.split('T')[0].split('-').map(Number)
  return { year, month, day }
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

  const { data: calendarResponse, isLoading, isError } = useGetDashboardCalendarInterviews({
    year: viewDate.year,
    month: viewDate.month + 1,
  })

  const calendarDays = getCalendarDays(viewDate.year, viewDate.month)
  const monthLabel = `${viewDate.year}년 ${viewDate.month + 1}월`

  const calendarEntries = useMemo<CalendarDateEntry[]>(() => {
    return (calendarResponse?.result ?? [])
      .map((entry) => {
        const { year, month, day } = parseCalendarDate(entry.date)
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null
        return {
          year,
          month,
          day,
          dDay: entry.dDay,
          interviews: entry.interviews ?? [],
        }
      })
      .filter((entry): entry is CalendarDateEntry => entry !== null)
  }, [calendarResponse?.result])

  const eventColorByDay = useMemo(() => {
    const mapped: Partial<Record<number, EventColor>> = {}

    calendarEntries.forEach((entry) => {
      if (entry.year !== viewDate.year || entry.month !== viewDate.month + 1) return

      const hasPendingReview = entry.interviews.some((interview) => interview.interviewReviewStatus !== 'DEBRIEF_COMPLETED')
      mapped[entry.day] = hasPendingReview ? 'orange' : 'gray'
    })

    return mapped
  }, [calendarEntries, viewDate.month, viewDate.year])

  const selectedDateInterviews = useMemo<CalendarInterviewItem[]>(() => {
    const selectedEntry = calendarEntries.find(
      (entry) =>
        entry.year === selectedDate.year && entry.month === selectedDate.month + 1 && entry.day === selectedDate.day,
    )
    if (!selectedEntry) return []
    return selectedEntry.interviews.map((interview) => ({ dDay: selectedEntry.dDay, interview }))
  }, [calendarEntries, selectedDate.day, selectedDate.month, selectedDate.year])

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
  const getEventColor = (day: number): EventColor | undefined => eventColorByDay[day]

  return {
    today,
    viewDate,
    selectedDate,
    calendarDays,
    monthLabel,
    isLoading,
    isError,
    selectedDateInterviews,
    prevMonth,
    nextMonth,
    handleDateClick,
    getEventColor,
  }
}
