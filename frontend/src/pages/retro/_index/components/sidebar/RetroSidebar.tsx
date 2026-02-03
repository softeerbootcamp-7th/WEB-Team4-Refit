import { useRetroContext } from '@/pages/retro/_index/contexts'
import { NoteIcon } from '@/shared/assets'
import { ContainerWithHeader, ContainerWithoutHeader, ListItemLarge, SidebarLayout } from '@/shared/components'
import { INTERVIEW_INFO_LABELS } from '@/shared/constants/retro'
import { MOCK_INTERVIEW_INFO_DATA, MOCK_RETRO_LIST } from '../../example'

export function RetroSidebar() {
  const { currentIndex, navigate } = useRetroContext()

  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <ContainerWithoutHeader>
        {INTERVIEW_INFO_LABELS.map(({ key, label }) => (
          <div key={key} className="flex gap-2">
            <label className="body-s-semibold w-18.5 text-gray-300">{label}</label>
            <span className="body-s-medium w-33.75 text-gray-800">{MOCK_INTERVIEW_INFO_DATA[key]}</span>
          </div>
        ))}
      </ContainerWithoutHeader>
      <ContainerWithHeader title="회고 리스트">
        {MOCK_RETRO_LIST.map(({ qnaSetId, questionText }, index) => (
          <ListItemLarge
            key={qnaSetId}
            content={`${index + 1}. ${questionText}`}
            active={currentIndex === index}
            onClick={() => navigate(index)}
          />
        ))}
      </ContainerWithHeader>
    </SidebarLayout>
  )
}
