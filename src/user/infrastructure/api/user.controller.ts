import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import {
  CREATE_USER_USE_CASE_PORT,
  CreateUserUseCase,
} from '../../domain/ports/in/create-user.usecase'
import {
  FIND_USER_USE_CASE_PORT,
  FindUserUseCase,
} from '../../domain/ports/in/find-user.usecase'
import { CreateUserDto } from './dto/create-user.dto'
import { UserResponseDto } from './dto/user-response.dto'

@Controller('users')
export class UserController {
  constructor(
    @Inject(CREATE_USER_USE_CASE_PORT)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(FIND_USER_USE_CASE_PORT)
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.createUser(createUserDto)
    return UserResponseDto.fromDomain(user)
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.findUserUseCase.findOneById(id)
    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다: ${id}`)
    }
    return UserResponseDto.fromDomain(user)
  }

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.findUserUseCase.findAll()
    return users.map((user) => UserResponseDto.fromDomain(user))
  }
}
