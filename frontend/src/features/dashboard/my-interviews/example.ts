import type { InterviewType } from '@/types/interview'

export type InterviewItemType = {
  resultStatus: 'wait' | 'pass' | 'fail'
  date: string
  company: string
  jobRole: string
  interviewType: string
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
    resultStatus: 'pass',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'wait',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'fail',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'pass',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'fail',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'pass',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'wait',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
  {
    resultStatus: 'pass',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
  },
]

export const MOCK_QUESTION_RANKS: QuestionRankType[] = [
  { categoryId: 13, categoryName: '리더십', frequentCount: 12 },
  { categoryId: 8, categoryName: '갈등 해결', frequentCount: 9 },
  { categoryId: 21, categoryName: '협업 경험', frequentCount: 8 },
  { categoryId: 5, categoryName: '실패 경험', frequentCount: 7 },
  { categoryId: 2, categoryName: '성장 과정', frequentCount: 0 },
]

export const MOCK_QUESTION_PREVIEWS: Record<string, QuestionPreviewType[]> = {
  리더십: [
    {
      resultStatus: 'pass',
      date: '2025. 11. 29',
      company: '현대자동차',
      jobRole: '데이터 사이언티스트',
      interviewType: 'CULTURE_FIT',
      question: '팀에서 리더 역할을 맡았던 경험이 있나요? 그때 어떻게 팀을 이끌었는지 말씀해주세요.',
    },
    {
      resultStatus: 'wait',
      date: '2025. 11. 25',
      company: '카카오',
      jobRole: '프론트엔드 개발자',
      interviewType: 'FIRST',
      question: '리더십을 발휘해서 프로젝트를 성공적으로 이끈 경험을 말씀해주세요.',
    },
    {
      resultStatus: 'pass',
      date: '2025. 11. 20',
      company: '네이버',
      jobRole: '서비스 기획',
      interviewType: 'BEHAVIORAL',
      question: '팀원 간 의견이 충돌할 때 리더로서 어떻게 해결하셨나요?',
    },
  ],
  '갈등 해결': [
    {
      resultStatus: 'fail',
      date: '2025. 11. 28',
      company: '토스',
      jobRole: '백엔드 개발자',
      interviewType: 'BEHAVIORAL',
      question: '팀 내 갈등이 발생했을 때 어떻게 중재하셨나요?',
    },
    {
      resultStatus: 'pass',
      date: '2025. 11. 22',
      company: '카카오',
      jobRole: '서비스 기획',
      interviewType: 'CULTURE_FIT',
      question: '상사와 의견이 다를 때 어떻게 대처하시나요?',
    },
    {
      resultStatus: 'wait',
      date: '2025. 11. 18',
      company: '네이버',
      jobRole: 'PM',
      interviewType: 'SECOND',
      question: '고객과 갈등 상황을 해결한 경험을 말씀해주세요.',
    },
  ],
  '협업 경험': [
    {
      resultStatus: 'pass',
      date: '2025. 11. 27',
      company: '라인',
      jobRole: '프론트엔드 개발자',
      interviewType: 'TECHNICAL',
      question: '다른 팀과 협업하여 프로젝트를 완수한 경험이 있나요?',
    },
    {
      resultStatus: 'pass',
      date: '2025. 11. 21',
      company: '쿠팡',
      jobRole: '데이터 엔지니어',
      interviewType: 'FIRST',
      question: '비개발 직군과 협업할 때 소통 방식을 설명해주세요.',
    },
    {
      resultStatus: 'fail',
      date: '2025. 11. 15',
      company: '배민',
      jobRole: '백엔드 개발자',
      interviewType: 'CULTURE_FIT',
      question: '협업 중 가장 어려웠던 점과 극복 방법을 알려주세요.',
    },
  ],
  '실패 경험': [
    {
      resultStatus: 'wait',
      date: '2025. 11. 26',
      company: '현대자동차',
      jobRole: '서비스 기획',
      interviewType: 'EXECUTIVE',
      question: '가장 큰 실패 경험과 그로부터 배운 점을 말씀해주세요.',
    },
    {
      resultStatus: 'pass',
      date: '2025. 11. 19',
      company: '삼성전자',
      jobRole: 'SW 개발자',
      interviewType: 'BEHAVIORAL',
      question: '프로젝트가 실패한 적이 있나요? 어떻게 대처하셨나요?',
    },
    {
      resultStatus: 'fail',
      date: '2025. 11. 12',
      company: 'SK하이닉스',
      jobRole: '데이터 분석가',
      interviewType: 'FIRST',
      question: '실패를 통해 성장한 경험을 구체적으로 설명해주세요.',
    },
  ],
  '성장 과정': [
    {
      resultStatus: 'pass',
      date: '2025. 11. 24',
      company: '토스',
      jobRole: '프론트엔드 개발자',
      interviewType: 'TECHNICAL',
      question: '최근 1년간 가장 크게 성장한 부분은 무엇인가요?',
    },
    {
      resultStatus: 'pass',
      date: '2025. 11. 17',
      company: '카카오',
      jobRole: '백엔드 개발자',
      interviewType: 'CULTURE_FIT',
      question: '자기 개발을 위해 어떤 노력을 하고 계신가요?',
    },
    {
      resultStatus: 'wait',
      date: '2025. 11. 10',
      company: '네이버',
      jobRole: 'PM',
      interviewType: 'BEHAVIORAL',
      question: '커리어에서 전환점이 된 경험을 말씀해주세요.',
    },
  ],
}

export const MOCK_QNA: QnaItemType[] = [
  {
    resultStatus: 'pass',
    date: '2025. 11. 29 응시',
    company: '현대자동차',
    jobRole: '데이터 사이언티스트',
    interviewType: 'CULTURE_FIT',
    question: '팀에서 리더 역할을 맡았던 경험이 있나요?',
    answer: '대학교 졸업 프로젝트에서 팀장을 맡아 5명의 팀원들과 함께 AI 기반 추천 시스템을 개발했습니다.',
  },
  {
    resultStatus: 'wait',
    date: '2025. 11. 29 응시',
    company: '카카오',
    jobRole: '프론트엔드 개발자',
    interviewType: 'FIRST',
    question: '가장 어려웠던 기술적 문제와 해결 과정을 설명해주세요.',
    answer:
      '실시간 채팅 서비스에서 WebSocket 연결이 끊기는 문제를 해결하기 위해 재연결 로직과 메시지 큐를 구현했습니다.',
  },
  {
    resultStatus: 'fail',
    date: '2025. 11. 25 응시',
    company: '네이버',
    jobRole: '서비스 기획',
    interviewType: 'BEHAVIORAL',
    question: '협업 과정에서 갈등이 생겼을 때 어떻게 해결하시나요?',
    answer: '먼저 상대방의 의견을 충분히 경청한 후, 공통점을 찾아 합의점을 도출하려고 노력합니다.',
  },
  {
    resultStatus: 'pass',
    date: '2025. 11. 20 응시',
    company: '토스',
    jobRole: '백엔드 개발자',
    interviewType: 'TECHNICAL',
    question: 'RESTful API 설계 원칙에 대해 설명해주세요.',
    answer: 'REST는 자원을 URI로 표현하고, HTTP 메서드를 통해 자원에 대한 행위를 정의하는 아키텍처 스타일입니다.',
  },
]
