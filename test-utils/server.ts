import { setupServer } from 'msw/node'

const server = setupServer()

export { rest } from 'msw'
export { server }
