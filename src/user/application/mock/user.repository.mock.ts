import { vi } from 'vitest'

export const createUserRepositoryMock = () => ({
  findOneById: vi.fn(),
  findOneByEmail: vi.fn(),
  findAll: vi.fn(),
  save: vi.fn(),
})

export type UserRepositoryMock = ReturnType<typeof createUserRepositoryMock>
