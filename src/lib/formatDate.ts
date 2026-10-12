const DATE_FORMATTER = new Intl.DateTimeFormat('es', { dateStyle: 'long' })

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? 'Fecha desconocida' : DATE_FORMATTER.format(date)
}
