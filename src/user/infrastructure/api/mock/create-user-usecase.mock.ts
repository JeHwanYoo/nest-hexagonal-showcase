import { vi } from 'vitest'

export const createCreateUserUseCaseMock = () => ({
  createUser: vi.fn(),
})

export type CreateUserUseCaseMock = ReturnType<
  typeof createCreateUserUseCaseMock
>
