import { render as _render, type RenderOptions } from '@testing-library/react'
import React from 'react'

export const renderWithProviders = (el: React.ReactElement, options?: RenderOptions) =>
	_render(el, { ...options })
