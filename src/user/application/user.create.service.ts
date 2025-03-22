import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { User } from '../domain/model/user.model'
import {
  CreateUserCommand,
  CreateUserUseCase,
} from '../domain/ports/in/create-user.usecase'
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../domain/ports/out/user-repository.port'

@Injectable()
export class UserCreateService implements CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email)
    if (existingUser) {
      throw new BadRequestException(
        `이미 존재하는 이메일입니다: ${command.email}`,
      )
    }

    const newUser = User.create(command.email, command.name)
    return this.userRepository.save(newUser)
  }
}
