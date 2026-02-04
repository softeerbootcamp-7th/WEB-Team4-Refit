import { useState } from 'react'
import type { DifficultQuestionCardData } from '@/pages/dashboard/_index/components/difficult-questions/DifficultQuestionCard'

const MOCK_DIFFICULT_QUESTIONS: DifficultQuestionCardData[] = [
  {
    id: 1,
    companyName: '현대자동차',
    date: '2024.03.01 응시',
    jobCategory: 'UI Designer',
    interviewType: '기술 면접',
    questionSnippet:
      'A 프로젝트에서 이렇게 작업한 이유와 작업 과정에서의 힘든 점을 자세하게 설명해주시고, 타파하려고 노력한 본인의 노...',
  },
  {
    id: 2,
    companyName: '현대자동',
    date: '2024.03.01 응시',
    jobCategory: 'UI Designer',
    interviewType: '기술 면접',
    questionSnippet:
      'A 프로젝트에서 이렇게 작업한 이유와 작업 과정에서의 힘든 점을 자세하게 설명해주시고, 타파하려고 노력한 본인의 노...',
  },
  {
    id: 3,
    companyName: '현대자',
    date: '2024.03.01 응시',
    jobCategory: 'UI Designer',
    interviewType: '기술 면접',
    questionSnippet:
      'A 프로젝트에서 이렇게 작업한 이유와 작업 과정에서의 힘든 점을 자세하게 설명해주시고, 타파하려고 노력한 본인의 노...',
  },
  {
    id: 4,
    companyName: '현대',
    date: '2024.03.01 응시',
    jobCategory: 'UI Designer',
    interviewType: '기술 면접',
    questionSnippet:
      'A 프로젝트에서 이렇게 작업한 이유와 작업 과정에서의 힘든 점을 자세하게 설명해주시고, 타파하려고 노력한 본인의 노...',
  },
]

export const useDifficultQuestions = () => {
  const [data] = useState<DifficultQuestionCardData[]>(MOCK_DIFFICULT_QUESTIONS)
  return { data, count: data.length }
}
