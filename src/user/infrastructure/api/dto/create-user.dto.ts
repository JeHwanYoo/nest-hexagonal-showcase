import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { CreateUserCommand } from '../../../domain/ports/in/create-user.usecase'

export class CreateUserDto implements CreateUserCommand {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of the user', format: 'email' })
  email!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the user' })
  name!: string
}
