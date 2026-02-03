import InterviewCalendar from '@/pages/dashboard/_index/components/interview-calendar/InterviewCalendar'

export default function DashboardPage() {
  return (
    <div className="mx-auto flex items-start gap-6">
      <main className="bg-gray-white min-w-0 flex-1" />
      <aside className="bg-gray-150 sticky top-0 min-h-[calc(100vh-60px)] w-[320px] shrink-0 rounded-tl-[20px] px-5 py-7">
        <InterviewCalendar />
      </aside>
    </div>
  )
}
