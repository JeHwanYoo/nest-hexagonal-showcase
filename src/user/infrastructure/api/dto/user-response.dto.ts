import { User } from '../../../domain/model/user.model'

export class UserResponseDto {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date

  static fromDomain(user: User): UserResponseDto {
    return Object.assign(new UserResponseDto(), user)
  }
}
