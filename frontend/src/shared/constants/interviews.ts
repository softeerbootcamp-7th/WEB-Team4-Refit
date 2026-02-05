import type { LabelValueType } from '@/types/global'

export const INTERVIEW_TYPE_OPTIONS: LabelValueType[] = [
  { value: 'first', label: '1차 면접' },
  { value: 'second', label: '2차 면접' },
  { value: 'third', label: '3차 면접' },
  { value: 'personality', label: '인성 면접' },
  { value: 'technical', label: '기술 면접' },
  { value: 'executive', label: '임원 면접' },
  { value: 'culture', label: '컬쳐핏 면접' },
  { value: 'coffee', label: '커피챗' },
  { value: 'mock', label: '모의 면접' },
]
