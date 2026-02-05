export type TabItem = {
  label: string
  value: string
}

type TabBarProps = {
  items: TabItem[]
  activeValue: string
  onChange: (value: string) => void
  className?: string
}

export default function TabBar({ items, activeValue, onChange, className }: TabBarProps) {
  return (
    <div className={`border-gray-150 flex flex-1 border-b ${className}`}>
      {items.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`mr-5 cursor-pointer border-b-[3px] pb-1 ${
            activeValue === value
              ? 'title-m-bold border-gray-800 text-gray-800'
              : 'title-m-medium border-transparent text-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
