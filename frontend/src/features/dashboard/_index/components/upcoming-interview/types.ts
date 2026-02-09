import type { ReactNode } from 'react'

export interface InterviewQuestion {
  id: number
  text: string
}

export interface PastInterview {
  id: number
  date: string
  companyName: string
  industry: string
  jobCategory: string
  interviewType: string
  logo?: ReactNode
}

export interface UpcomingInterviewData {
  id: number
  dDay: string
  companyName: string
  position: string
  datetime: string
  recentQuestions: InterviewQuestion[]
  lastUpdated: string
  similarInterviews: PastInterview[]
  companyLogo?: ReactNode
}
