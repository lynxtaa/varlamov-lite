/** Checks if string could be presented as number */
export function isNumber(value: string): boolean {
	return value.trim() !== '' && Number.isFinite(Number(value))
}
