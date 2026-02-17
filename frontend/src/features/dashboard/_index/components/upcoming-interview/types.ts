import type { ReactNode } from 'react'

export interface InterviewQuestion {
  id: number
  text: string
}

export interface UpcomingInterviewData {
  id: number
  dDay: string
  companyName: string
  jobCategoryName: string
  position: string
  datetime: string
  recentQuestions: InterviewQuestion[]
  lastUpdated: string
  companyLogo?: ReactNode
}
