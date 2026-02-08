import { format } from 'date-fns'

export function formatDate(dateString: string, formatStr = 'yyyy.MM.dd.') {
  return format(new Date(dateString), formatStr)
}

export function formatDateTime(dateString: string) {
  return format(new Date(dateString), 'yyyy.MM.dd. HH:mm')
}
