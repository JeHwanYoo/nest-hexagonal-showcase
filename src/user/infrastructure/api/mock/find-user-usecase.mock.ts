import { vi } from 'vitest'

export const createFindUserUseCaseMock = () => ({
  findOneById: vi.fn(),
  findOneByEmail: vi.fn(),
  findAll: vi.fn(),
})

export type FindUserUseCaseMock = ReturnType<typeof createFindUserUseCaseMock>
