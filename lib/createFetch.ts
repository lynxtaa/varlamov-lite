import { IncomingHttpHeaders } from 'node:http'

import { z } from 'zod'

export type FetchOptions = {
	prefixUrl?: string
	timeout?: number
	headers?: {
		[K in keyof IncomingHttpHeaders]: string
	}
	json?: unknown
} & Omit<RequestInit, 'signal' | 'headers'>

export interface FetchFunction {
	(url: string, options?: FetchOptions): Promise<Response>
	<T>(url: string, options: FetchOptions & { schema: z.Schema<T> }): Promise<T>
}

export function createFetch(defaults: FetchOptions = {}): FetchFunction {
	return async function (
		url: string,
		options: FetchOptions & { schema?: z.Schema<unknown> } = {},
	): Promise<any> {
		const {
			timeout = 30_000,
			prefixUrl = '',
			json,
			...allOptions
		} = {
			...defaults,
			...options,
			headers: { ...defaults.headers, ...options.headers },
		}
		const abortController = new AbortController()

		const timer =
			timeout > 0 ? setTimeout(() => abortController.abort(), timeout) : undefined

		if (json !== undefined && json !== null) {
			allOptions.body = JSON.stringify(json)
			allOptions.headers['content-type'] ??= 'application/json'
		}

		try {
			const response = await fetch(`${prefixUrl}${url}`, {
				...allOptions,
				signal: abortController.signal,
			})
			if (!response.ok) {
				throw new Error(`Bad response ${response.status}`)
			}
			if (allOptions.schema) {
				const json = await response.json()
				return allOptions.schema.parse(json)
			}
			return response
		} finally {
			clearTimeout(timer)
		}
	}
}
