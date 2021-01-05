import { format, isToday, isYesterday, parseISO, isThisYear } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(dateOrString: Date | string): string {
	const date = typeof dateOrString === 'string' ? parseISO(dateOrString) : dateOrString

	if (isToday(date)) {
		return `сегодня в ${format(date, 'H:mm')}`
	}

	if (isYesterday(date)) {
		return `вчера в ${format(date, 'H:mm')}`
	}

	if (isThisYear(date)) {
		return format(date, 'd MMMM', { locale: ru })
	}

	return format(date, 'd MMMM yyyy', { locale: ru })
}
