import type { FrequentQuestionCategory } from '../../mappers'

type Props = {
  categories: FrequentQuestionCategory[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number) => void
}

export default function CategoryList({ categories, selectedCategoryId, onSelect }: Props) {
  return (
    <div className="flex shrink-0 basis-1/4 flex-col gap-2">
      {categories.map(({ categoryId, categoryName, frequentCount }, idx) => (
        <div
          key={categoryId}
          className={`flex cursor-pointer items-center justify-between rounded-lg px-6 py-2 transition-colors hover:bg-gray-100 ${selectedCategoryId === categoryId ? 'bg-gray-100' : ''}`}
          onClick={() => onSelect(categoryId)}
        >
          <div className="body-s-semibold flex items-center gap-5">
            <span className={`${idx < 3 ? 'text-gray-800' : 'text-gray-300'}`}>{idx + 1}</span>
            <span className="text-gray-700">{categoryName}</span>
          </div>
          <span className="body-s-semibold text-gray-700">{frequentCount}회</span>
        </div>
      ))}
    </div>
  )
}
