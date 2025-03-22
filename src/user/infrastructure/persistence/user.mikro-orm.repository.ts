import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { User } from '../../domain/model/user.model'
import { UserRepositoryPort } from '../../domain/ports/out/user-repository.port'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserMikroOrmRepository implements UserRepositoryPort {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.em.findOne(UserEntity, { id })
    return entity ? entity.toDomain() : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.em.findOne(UserEntity, { email })
    return entity ? entity.toDomain() : null
  }

  async findAll(): Promise<User[]> {
    const entities = await this.em.find(UserEntity, {})
    return entities.map((entity) => entity.toDomain())
  }

  async save(user: User): Promise<User> {
    const entity = UserEntity.fromDomain(user)
    await this.em.persistAndFlush(entity)
    return entity.toDomain()
  }
}
