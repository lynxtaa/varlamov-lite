import { useRouter } from 'next/navigation'
import { vi } from 'vitest'

type AppRouterInstance = ReturnType<typeof useRouter>

export function createMockRouter(
	options?: Partial<AppRouterInstance>,
): AppRouterInstance {
	return {
		push: vi.fn(),
		replace: vi.fn(),
		refresh: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		...options,
	}
}
