type ListItemProps = {
  content: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export const ListItemSmall = ({ content, active = false, onClick, className }: ListItemProps) => {
  return (
    <div
      className={[
        baseStyles,
        'body-s-semibold justify-center',
        active ? 'text-primary-700 bg-gray-100' : '',
        className ?? '',
      ].join(' ')}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {content}
    </div>
  )
}

export const ListItemLarge = ({ content, active = false, onClick, className }: ListItemProps) => {
  return (
    <div
      className={[
        baseStyles,
        'body-s-medium px-2.5',
        active ? 'bg-primary-100 text-primary-700' : '',
        className ?? '',
      ].join(' ')}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {content}
    </div>
  )
}

const baseStyles =
  'flex w-full items-center rounded-[10px] py-2.5 hover:bg-gray-100 cursor-pointer focus:outline-none focus:bg-gray-200'
