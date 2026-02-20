import { useMemo, useState } from 'react'
import { getLocalTimeZone, today } from '@internationalized/date'
import { useGetDashboardCalendarInterviews } from '@/apis'
import type { InterviewDto } from '@/apis'
import type { EventColor } from '@/features/dashboard/_index/constants/interviewCalendar'
import type { CalendarDate } from '@internationalized/date'

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

function parseCalendarDate(date: string) {
  const [year, month, day] = date.split('T')[0].split('-').map(Number)
  return { year, month, day }
}

export const useInterviewCalendar = () => {
  const [todayValue] = useState<CalendarDate>(() => today(getLocalTimeZone()))
  const [focusedValue, setFocusedValue] = useState<CalendarDate>(todayValue)
  const [selectedValue, setSelectedValue] = useState<CalendarDate>(todayValue)
  const viewDate = useMemo(
    () => ({
      year: focusedValue.year,
      month: focusedValue.month - 1,
    }),
    [focusedValue.month, focusedValue.year],
  )
  const selectedDate = useMemo(
    () => ({
      year: selectedValue.year,
      month: selectedValue.month - 1,
      day: selectedValue.day,
    }),
    [selectedValue.day, selectedValue.month, selectedValue.year],
  )

  const { data: calendarResponse, isLoading, isError } = useGetDashboardCalendarInterviews({
    year: viewDate.year,
    month: viewDate.month + 1,
  })

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

  const eventColorByDate = useMemo(() => {
    const mapped: Partial<Record<`${number}-${number}-${number}`, EventColor>> = {}

    calendarEntries.forEach((entry) => {
      const hasPendingReview = entry.interviews.some((interview) => interview.interviewReviewStatus !== 'DEBRIEF_COMPLETED')
      mapped[`${entry.year}-${entry.month}-${entry.day}`] = hasPendingReview ? 'orange' : 'gray'
    })

    return mapped
  }, [calendarEntries])

  const selectedDateInterviews = useMemo<CalendarInterviewItem[]>(() => {
    const selectedEntry = calendarEntries.find(
      (entry) =>
        entry.year === selectedDate.year && entry.month === selectedDate.month + 1 && entry.day === selectedDate.day,
    )
    if (!selectedEntry) return []
    return selectedEntry.interviews.map((interview) => ({ dDay: selectedEntry.dDay, interview }))
  }, [calendarEntries, selectedDate.day, selectedDate.month, selectedDate.year])

  const getEventColor = (date: CalendarDate): EventColor | undefined => {
    if (date.year !== viewDate.year || date.month !== viewDate.month + 1) return undefined
    return eventColorByDate[`${date.year}-${date.month}-${date.day}`]
  }

  return {
    focusedValue,
    selectedValue,
    viewDate,
    selectedDate,
    isLoading,
    isError,
    selectedDateInterviews,
    setFocusedValue,
    setSelectedValue,
    getEventColor,
  }
}
