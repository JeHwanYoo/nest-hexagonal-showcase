import { User } from '../../model/user.model'

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT')

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  save(user: User): Promise<User>
}
