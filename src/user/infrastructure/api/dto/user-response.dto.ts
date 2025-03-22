import { User } from '@/user/domain/model/user.model'
import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
  @ApiProperty({ description: 'The id of the user', format: 'uuid' })
  id: string

  @ApiProperty({ description: 'The email of the user', format: 'email' })
  email: string

  @ApiProperty({ description: 'The name of the user' })
  name: string

  @ApiProperty({
    description: 'The created at of the user',
    format: 'date-time',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The updated at of the user',
    format: 'date-time',
  })
  updatedAt: Date

  static fromDomain(user: User): UserResponseDto {
    return Object.assign(new UserResponseDto(), user)
  }
}
