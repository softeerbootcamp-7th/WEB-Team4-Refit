import type { FrequentQuestionCategory } from '../../mappers'

type Props = {
  categories: FrequentQuestionCategory[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number) => void
}

export default function CategoryList({ categories, selectedCategoryId, onSelect }: Props) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-2">
      {categories.map(({ categoryId, categoryName, frequentCount }, idx) => (
        <button
          type="button"
          key={categoryId}
          className={`flex w-full cursor-pointer items-center justify-between gap-1 rounded-lg px-4 py-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${selectedCategoryId === categoryId ? 'bg-gray-100' : ''}`}
          onClick={() => onSelect(categoryId)}
        >
          <div className="body-s-semibold flex min-w-0 flex-1 items-center gap-3">
            <span className={`shrink-0 ${idx < 3 ? 'text-gray-800' : 'text-gray-300'}`}>{idx + 1}</span>
            <span className="min-w-0 truncate text-gray-700">{categoryName}</span>
          </div>
          <span className="body-s-semibold shrink-0 text-gray-700">{frequentCount}회</span>
        </button>
      ))}
    </div>
  )
}
