import { NoteIcon } from '@/assets'

// TODO: 리팩토링 필요
export default function CloseSidebar() {
  const num = 7
  return (
    <div className="bg-gray-white fixed top-6.75 left-6 flex h-[80vh] w-14 flex-col items-center gap-4 rounded-xl px-1.25 py-3.75">
      <NoteIcon />
      <Border />
      <div className="flex w-full flex-col items-center gap-0.5">
        {Array.from({ length: num }).map((_, index) => (
          <Section key={index} num={`${index + 1}`} />
        ))}
      </div>
    </div>
  )
}

const Section = ({ key, num }: { key: number; num: string }) => {
  return (
    <div
      key={key}
      className="body-s-semibold flex h-10.25 w-full items-center justify-center rounded-[10px] hover:bg-gray-100"
    >
      {num}번
    </div>
  )
}

const Border = () => {
  return <div className="border-gray-150 h-0 w-10.5 border-[0.5px]" />
}
