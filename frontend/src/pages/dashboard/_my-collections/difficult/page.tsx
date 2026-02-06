import QnaCardListSection from '../components/QnaCardListSection'
import type { QnaCardListItem } from '../components/QnaCardListSection'

const MOCK_DIFFICULT_QUESTIONS: (QnaCardListItem & { tags?: readonly { type: string; text: string }[] })[] = [
  {
    id: 1,
    date: '2025.10.05',
    company: '네이버',
    job: '백엔드 개발',
    interviewType: '2차 면접',
    question: '대규모 트래픽 발생 시 부하 분산 전략에 대해 설명해주세요.',
    resultStatus: 'pass',
    tags: [
      { type: 'pass', text: '합격' },
      { type: 'practice', text: '실전면접' },
    ],
  },
  {
    id: 2,
    date: '2025.09.20',
    company: '카카오',
    job: '서버 개발',
    interviewType: '1차 면접',
    question: 'Database Deadlock이 발생하는 원인과 해결 방안은 무엇인가요?',
    resultStatus: 'wait',
    tags: [{ type: 'practice', text: '모의면접' }],
  },
  {
    id: 3,
    date: '2025.09.15',
    company: '라인',
    job: '플랫폼 엔지니어링',
    interviewType: '기술 면접',
    question: 'MSA 환경에서 트랜잭션 관리를 어떻게 수행해야 하나요?',
    resultStatus: 'pass',
    tags: [{ type: 'pass', text: '합격' }],
  },
]

export default function DifficultQuestionPage() {
  return <QnaCardListSection title="어려웠던 질문" items={MOCK_DIFFICULT_QUESTIONS} />
}
