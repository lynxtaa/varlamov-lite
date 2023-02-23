import { useRouter } from 'next/navigation'

export type AppRouterInstance = ReturnType<typeof useRouter>

export function createMockRouter(
	options?: Partial<AppRouterInstance>,
): AppRouterInstance {
	return {
		push: jest.fn(),
		replace: jest.fn(),
		refresh: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		...options,
	}
}
