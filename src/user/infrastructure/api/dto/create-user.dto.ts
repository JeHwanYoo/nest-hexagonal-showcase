import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { CreateUserCommand } from '../../../domain/ports/in/create-user.usecase'

export class CreateUserDto implements CreateUserCommand {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  name!: string
}
