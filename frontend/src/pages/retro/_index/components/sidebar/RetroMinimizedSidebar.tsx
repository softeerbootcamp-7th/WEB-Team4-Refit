import { useRetroContext } from '@/pages/retro/_index/contexts'
import { NoteIcon } from '@/shared/assets'
import { Border, ListItemSmall, SidebarLayout } from '@/shared/components'
import { MOCK_RETRO_LIST } from '../../example'

export function RetroMinimizedSidebar() {
  const { currentIndex, navigate } = useRetroContext()

  return (
    <SidebarLayout isMinimized>
      <NoteIcon width="24" height="24" className="shrink-0" />
      <Border />
      <div className="flex w-full flex-col items-center gap-0.5">
        {MOCK_RETRO_LIST.map(({ qnaSetId }, index) => (
          <ListItemSmall
            key={qnaSetId}
            content={`${index + 1}번`}
            active={currentIndex === index}
            onClick={() => navigate(index)}
          />
        ))}
      </div>
    </SidebarLayout>
  )
}
