import { Inject, Injectable } from '@nestjs/common'
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../domain/ports/out/user-repository.port'
import { User } from '../domain/model/user.model'
import { FindUserUseCase } from '../domain/ports/in/find-user.usecase'

@Injectable()
export class UserFindService implements FindUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
