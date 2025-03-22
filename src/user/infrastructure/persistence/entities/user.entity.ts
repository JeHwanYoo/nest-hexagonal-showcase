import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { User as UserModel } from '../../../domain/model/user.model'

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey()
  id!: string

  @Property({ unique: true })
  email!: string

  @Property()
  name!: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  toDomain(): UserModel {
    return new UserModel(
      this.id,
      this.email,
      this.name,
      this.createdAt,
      this.updatedAt,
    )
  }

  static fromDomain(user: UserModel): UserEntity {
    return Object.assign(new UserEntity(), user)
  }
}
