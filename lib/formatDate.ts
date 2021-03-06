import { format, isToday, isYesterday, parseISO, isThisYear } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ru } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
	const date = utcToZonedTime(parseISO(dateStr), 'Europe/Moscow')

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
