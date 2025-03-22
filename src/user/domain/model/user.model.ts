import { ModelInput } from '@/shared/helper/model'
import { v7 as uuidv7 } from 'uuid'

export class User {
  readonly id: string = uuidv7()
  readonly email: string
  readonly name: string
  readonly createdAt: Date = new Date()
  readonly updatedAt: Date = new Date()

  constructor(user: ModelInput<User>) {
    Object.assign(this, user)
  }

  static create(email: string, name: string): User {
    return new User({
      email,
      name,
    })
  }
}
