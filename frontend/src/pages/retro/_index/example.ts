import type { InterviewFullType, QnaSetType, StarAnalysisResult } from '@/types/interview'

export const MOCK_INTERVIEW_INFO_DATA: Pick<
  InterviewFullType,
  'company' | 'jobRole' | 'interviewType' | 'interviewStartAt'
> = {
  company: '현대자동차 소프티어',
  jobRole: '디자인 UI Designer',
  interviewType: 'second',
  interviewStartAt: '2026-03-01T11:00:00',
}

export type RetroListItem = Pick<QnaSetType, 'qnaSetId' | 'questionText' | 'answerText'> & { isKpt?: boolean }

export const MOCK_RETRO_LIST: RetroListItem[] = [
  {
    qnaSetId: 1,
    questionText: '자기소개 부탁드립니다',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 2,
    questionText: '작업하신 디자인 컨셉에 대해 소개해 주세요.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 3,
    questionText: '해당 디자인 컨셉이나 실제 디자인에서 아쉬운 점은 무엇인가요?',
    answerText: '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 4,
    questionText: '인생에서 가장 힘들었던 순간이 있었다면 무엇인가요?',
    answerText: '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 5,
    questionText: '그 디자인 컨셉에 대한 본인만의 차별점은 무엇인가요?',
    answerText: '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 6,
    questionText: '잘 모르겠는데 아무튼 인성 관련 면접 질문입니다.',
    answerText: '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 7,
    questionText: '인성관련 면접 질문 2',
    answerText: '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 8,
    questionText: '최종 KPT 회고',
    answerText: '',
    isKpt: true,
  },
]

export const MOCK_STAR_ANALYSIS: StarAnalysisResult = {
  sInclusionLevel: 'present',
  tInclusionLevel: 'insufficient',
  aInclusionLevel: 'absent',
  rInclusionLevel: 'present',
  overallSummary: 'Situation과 Result 항목은 충분하지만 t와 a 항목에서 부족한 모습이 보입니다.',
}
