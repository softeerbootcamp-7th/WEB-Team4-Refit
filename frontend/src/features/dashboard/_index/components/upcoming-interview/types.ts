export interface InterviewQuestion {
  id: number
  text: string
}

export interface UpcomingInterviewData {
  id: number
  dDay: string
  companyName: string
  companyLogoUrl?: string
  jobCategoryName: string
  position: string
  datetime: string
  recentQuestions: InterviewQuestion[]
  lastUpdated: string
}
