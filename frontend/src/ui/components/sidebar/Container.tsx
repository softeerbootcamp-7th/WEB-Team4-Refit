import Border from '@/ui/components/border'

type ContainerWithHeaderProps = {
  title: string
  className?: string
  children: React.ReactNode
}
type ContainerWithoutHeaderProps = Omit<ContainerWithHeaderProps, 'title'>

export const ContainerWithoutHeader = ({ children }: ContainerWithoutHeaderProps) => {
  return <div className="bg-gray-white flex flex-col gap-1.5 rounded-[10px] px-6 py-4">{children}</div>
}

export const ContainerWithHeader = ({ title, className, children }: ContainerWithHeaderProps) => {
  return (
    <div className={`bg-gray-white flex w-full flex-1 flex-col gap-0.5 rounded-[10px] px-3.5 py-4 ${className}`}>
      <span className="body-l-semibold mb-2.5 ml-2.75">{title}</span>
      <Border />
      <div className="no-scrollbar mt-4 overflow-y-auto">{children}</div>
    </div>
  )
}
