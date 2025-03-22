import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
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
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger'

@Controller('users')
export class UserController {
  constructor(
    @Inject(CREATE_USER_USE_CASE_PORT)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(FIND_USER_USE_CASE_PORT)
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.createUser(createUserDto)
    return UserResponseDto.fromDomain(user)
  }

  @Get()
  @ApiOperation({ summary: 'Get All Users or Find Users By Email' })
  @ApiQuery({ name: 'email', required: false })
  @ApiBody({ type: UserResponseDto, isArray: true })
  async getUsers(@Query('email') email?: string): Promise<UserResponseDto[]> {
    if (email) {
      const user = await this.findUserUseCase.findOneByEmail(email)
      if (!user) {
        return []
      }
      return [UserResponseDto.fromDomain(user)]
    }

    const users = await this.findUserUseCase.findAll()
    return users.map((user) => UserResponseDto.fromDomain(user))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User By Id' })
  @ApiBody({ type: UserResponseDto })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.findUserUseCase.findOneById(id)
    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다: ${id}`)
    }
    return UserResponseDto.fromDomain(user)
  }
}
