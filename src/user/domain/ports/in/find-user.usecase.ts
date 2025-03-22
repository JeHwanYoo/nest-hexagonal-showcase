import { User } from '../../model/user.model'

export const FIND_USER_USE_CASE_PORT = Symbol('FIND_USER_USE_CASE_PORT')

export interface FindUserUseCase {
  findOneById(id: string): Promise<User | null>
  findOneByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
}
