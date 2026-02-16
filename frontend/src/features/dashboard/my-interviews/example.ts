import type { InterviewType } from '@/types/interview'

export type InterviewItemType = {
  resultStatus: 'WAIT' | 'PASS' | 'FAIL'
  date: string
  company: string
  jobRole: string
  interviewType: InterviewType
}

export type QuestionPreviewType = InterviewItemType & {
  question: string
}

export type QnaItemType = InterviewItemType & {
  question: string
  answer: string
}

export type QuestionRankType = {
  categoryId: number
  categoryName: string
  frequentCount: number
}

export type DraftItemType = {
  interviewId: number
  interviewStartAt: string
  company: string
  jobCategoryName: string
  interviewType: InterviewType
}

export const MOCK_DRAFTS: DraftItemType[] = [
  {
    interviewId: 1,
    interviewStartAt: '2025. 11. 19 응시',
    company: '현대자동차',
    jobCategoryName: '서비스 기획',
    interviewType: 'FIRST',
  },
  {
    interviewId: 2,
    interviewStartAt: '2025. 11. 19 응시',
    company: '현대자동차',
    jobCategoryName: '서비스 기획',
    interviewType: 'FIRST',
  },
  {
    interviewId: 3,
    interviewStartAt: '2025. 11. 19 응시',
    company: '현대자동차',
    jobCategoryName: '서비스 기획',
    interviewType: 'FIRST',
  },
  {
    interviewId: 4,
    interviewStartAt: '2025. 11. 19 응시',
    company: '현대자동차',
    jobCategoryName: '서비스 기획',
    interviewType: 'FIRST',
  },
  {
    interviewId: 5,
    interviewStartAt: '2025. 11. 19 응시',
    company: '현대자동차',
    jobCategoryName: '서비스 기획',
    interviewType: 'FIRST',
  },
]

export const MOCK_COMPLETED: InterviewItemType[] = [
  {
    resultStatus: 'PASS',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'WAIT',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'FAIL',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'PASS',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'FAIL',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'WAIT',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'WAIT',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'PASS',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
]

export const MOCK_QNA: QnaItemType[] = [
  {
    resultStatus: 'PASS',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
    question: '팀에서 리더 역할을 맡았던 경험이 있나요?',
    answer: '대학교 졸업 프로젝트에서 팀장을 맡아 5명의 팀원들과 함께 AI 기반 추천 시스템을 개발했습니다.',
  },
  {
    resultStatus: 'WAIT',
    date: '2025. 11. 29 응시',
    company: '카카오',
    jobRole: '프론트엔드 개발자',
    interviewType: 'FIRST',
    question: '가장 어려웠던 기술적 문제와 해결 과정을 설명해주세요.',
    answer:
      '실시간 채팅 서비스에서 WebSocket 연결이 끊기는 문제를 해결하기 위해 재연결 로직과 메시지 큐를 구현했습니다.',
  },
  {
    resultStatus: 'FAIL',
    date: '2025. 11. 25 응시',
    company: '네이버',
    jobRole: '서비스 기획',
    interviewType: 'BEHAVIORAL',
    question: '협업 과정에서 갈등이 생겼을 때 어떻게 해결하시나요?',
    answer: '먼저 상대방의 의견을 충분히 경청한 후, 공통점을 찾아 합의점을 도출하려고 노력합니다.',
  },
  {
    resultStatus: 'PASS',
    date: '2025. 11. 20 응시',
    company: '토스',
    jobRole: '백엔드 개발자',
    interviewType: 'TECHNICAL',
    question: 'RESTful API 설계 원칙에 대해 설명해주세요.',
    answer: 'REST는 자원을 URI로 표현하고, HTTP 메서드를 통해 자원에 대한 행위를 정의하는 아키텍처 스타일입니다.',
  },
]
