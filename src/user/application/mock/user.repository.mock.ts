import { vi } from 'vitest'

export const createUserRepositoryMock = () => ({
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findAll: vi.fn(),
  save: vi.fn(),
})

export type UserRepositoryMock = ReturnType<typeof createUserRepositoryMock>
