import { type ComponentProps } from 'react'

function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className="body-s-medium w-full overflow-auto">
      <table className={`w-full border-separate border-spacing-y-1 ${className}`} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead className={`${className}`} {...props} />
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      className={`[&>tr:hover>td]:bg-gray-100 [&>tr:hover>td:first-child]:rounded-l-lg [&>tr:hover>td:last-child]:rounded-r-lg ${className}`}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return <tr className={`${className}`} {...props} />
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      className={`body-s-medium border-gray-150 border-b px-4 py-2 text-left font-normal text-gray-400 ${className}`}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return <td className={`px-4 py-1 ${className}`} {...props} />
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
