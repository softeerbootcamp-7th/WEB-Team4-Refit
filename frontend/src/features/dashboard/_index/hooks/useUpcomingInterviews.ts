import { useState } from 'react'
import type { UpcomingInterviewData } from '../components/upcoming-interview/types'

const MOCK_UPCOMING_DATA: UpcomingInterviewData[] = [
  {
    id: 1,
    dDay: 'D-3',
    companyName: '현대자동차',
    position: 'UI Designer 2차 면접',
    datetime: '2026. 03. 01. 오후 2시',
    lastUpdated: '10:25',
    recentQuestions: [
      { id: 1, text: '현대자동차를 처음 알게 된 계기는 무엇인가?' },
      { id: 2, text: '직무 수행 중 입장이 다른 두 팀이 있는데 어떤 기준으로 자원분배하겠는가?' },
      { id: 3, text: '경영계획이 중요한 이유와 본인에게 주는 의미는 무엇인가?' },
    ],
    similarInterviews: [
      {
        id: 101,
        date: '2024. 03. 01',
        companyName: '현대자동차',
        industry: '제조업',
        jobCategory: '데이터 사이언티스트',
        interviewType: '컬쳐핏 면접',
      },
      {
        id: 102,
        date: '2024. 03. 01',
        companyName: '현대자동차',
        industry: '제조업',
        jobCategory: '데이터 사이언티스트',
        interviewType: '컬쳐핏 면접',
      },
    ],
  },
  {
    id: 2,
    dDay: 'D-3',
    companyName: '현대자동차',
    position: 'UI Designer 2차 면접',
    datetime: '2026. 03. 01. 오후 2시',
    lastUpdated: '10:25',
    recentQuestions: [
      { id: 1, text: '현대자동차를 처음 알게 된 계기는 무엇인가?' },
      { id: 2, text: '직무 수행 중 입장이 다른 두 팀이 있는데 어떤 기준으로 자원분배하겠는가?' },
      { id: 3, text: '경영계획이 중요한 이유와 본인에게 주는 의미는 무엇인가?' },
    ],
    similarInterviews: [
      {
        id: 201,
        date: '2024. 03. 01',
        companyName: '현대자동차',
        industry: '제조업',
        jobCategory: '데이터 사이언티스트',
        interviewType: '컬쳐핏 면접',
      },
      {
        id: 202,
        date: '2024. 03. 01',
        companyName: '현대자동차',
        industry: '제조업',
        jobCategory: '데이터 사이언티스트',
        interviewType: '컬쳐핏 면접',
      },
    ],
  },
]

export const useUpcomingInterviews = () => {
  // In the future, this will fetch data from an API
  const [data] = useState<UpcomingInterviewData[]>(MOCK_UPCOMING_DATA)

  return {
    data,
    count: data.length,
  }
}
