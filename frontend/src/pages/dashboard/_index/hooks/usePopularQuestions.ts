export interface PopularQuestionItem {
  id: number
  rank: number
  category: string
  industry: string
  jobCategory: string
}

const MOCK_POPULAR_QUESTIONS: PopularQuestionItem[] = [
  { id: 1, rank: 1, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 2, rank: 2, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 3, rank: 3, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 4, rank: 4, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 5, rank: 5, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 6, rank: 6, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 7, rank: 7, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 8, rank: 8, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 9, rank: 9, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
  { id: 10, rank: 10, category: '리더십 질문', industry: '연예·엔터테인먼트', jobCategory: '데이터 사이언티스트' },
]

export const usePopularQuestions = () => {
  return { data: MOCK_POPULAR_QUESTIONS }
}
