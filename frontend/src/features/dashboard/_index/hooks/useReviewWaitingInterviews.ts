import { useState } from 'react'
import type { ReviewWaitingData } from '../components/review-waiting-interview/ReviewWaitingCard'

const MOCK_REVIEW_WAITING_DATA: ReviewWaitingData[] = [
  {
    id: 1,
    status: '기록 전',
    elapsedText: '면접 끝난지 3일 지남',
    companyName: '현대자동차',
    industry: '제조업',
    jobCategory: '데이터 사이언티스트',
    interviewType: '컬쳐핏 면접',
  },
  {
    id: 2,
    status: '기록 전',
    elapsedText: '면접 끝난지 3일 지남',
    companyName: '현대자동차',
    industry: '제조업',
    jobCategory: '데이터 사이언티스트',
    interviewType: '컬쳐핏 면접',
  },
  {
    id: 3,
    status: '기록 전',
    elapsedText: '면접 끝난지 3일 지남',
    companyName: '현대자동차',
    industry: '제조업',
    jobCategory: '데이터 사이언티스트',
    interviewType: '컬쳐핏 면접',
  },
]

export const useReviewWaitingInterviews = () => {
  const [data] = useState<ReviewWaitingData[]>(MOCK_REVIEW_WAITING_DATA)

  return {
    data,
    count: data.length,
  }
}
