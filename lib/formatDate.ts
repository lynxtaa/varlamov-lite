import { format, isToday, parseISO, isThisYear } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(dateOrString: Date | string): string {
	const date = typeof dateOrString === 'string' ? parseISO(dateOrString) : dateOrString

	return isToday(date)
		? `сегодня в ${format(date, 'H:mm')}`
		: isThisYear(date)
		? format(date, 'd MMMM', { locale: ru })
		: format(date, 'd MMMM yyyy', { locale: ru })
}
