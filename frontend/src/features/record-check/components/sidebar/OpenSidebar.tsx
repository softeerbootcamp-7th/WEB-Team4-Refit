import { NoteIcon } from '@/assets'

// TODO: 리팩토링 필요
export default function OpenSidebar() {
  return (
    <div className="bg-gray-150 fixed top-15 left-0 flex h-screen w-80 flex-col gap-4 p-6 pb-12.5">
      <div className="inline-flex gap-2">
        <NoteIcon />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewInfoCard />
      <RetroList />
    </div>
  )
}

const InterviewInfoCard = () => {
  return (
    <Container>
      <InfoRow label="기업명" value="현차" />
      <InfoRow label="일시" value="2024.08.15 오전 11시" />
      <InfoRow label="직무" value="테스트" />
      <InfoRow label="면접 유형" value="1차 면접" />
    </Container>
  )
}

const RetroList = () => {
  const num = 7
  return (
    <div className="bg-gray-white flex min-h-screen w-full flex-col gap-0.5 rounded-[10px] px-3.5 py-4">
      <span className="body-l-semibold mb-2.5 ml-2.75">회고 리스트</span>
      <Border />
      {Array.from({ length: num }).map((_, index) => (
        <Section key={index} num={`${index + 1}`} />
      ))}
    </div>
  )
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-gray-white flex flex-col gap-1.5 rounded-[10px] px-6 py-4">{children}</div>
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex gap-2">
      <span className="body-s-semibold w-18.5 text-gray-300">{label}</span>
      <span className="body-s-medium w-33.75 text-gray-800">{value}</span>
    </div>
  )
}

const Section = ({ key, num }: { key: number; num: string }) => {
  return (
    <div key={key} className="body-s-medium flex w-full items-center rounded-[10px] p-2.5 hover:bg-gray-100">
      {num}. ~~
    </div>
  )
}

const Border = () => {
  return <div className="border-gray-150 mb-4 h-0 w-full border-[0.5px]" />
}
