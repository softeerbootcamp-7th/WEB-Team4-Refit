export type FormValues = {
  nickname: string
  industryId: string
  jobCategoryId: string
  isAgreedToTerms: boolean
}

export type SaveFeedback = {
  tone: 'success' | 'error'
  message: string
}

export type FormOption = {
  value: string
  label: string
}
