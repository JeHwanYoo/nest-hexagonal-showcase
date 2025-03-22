import { User } from '../../model/user.model'

export const CREATE_USER_USE_CASE_PORT = Symbol('CREATE_USER_USE_CASE_PORT')

export interface CreateUserCommand {
  email: string
  name: string
}

export interface CreateUserUseCase {
  createUser(command: CreateUserCommand): Promise<User>
}
