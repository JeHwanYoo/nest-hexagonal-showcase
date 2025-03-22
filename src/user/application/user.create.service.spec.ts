import { Test, TestingModule } from '@nestjs/testing'
import { randEmail, randFirstName } from '@ngneat/falso'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { User } from '../domain/model/user.model'
import { CreateUserCommand } from '../domain/ports/in/create-user.usecase'
import { USER_REPOSITORY_PORT } from '../domain/ports/out/user-repository.port'
import {
  UserRepositoryMock,
  createUserRepositoryMock,
} from './mock/user.repository.mock'
import { UserCreateService } from './user.create.service'
import { BadRequestException } from '@nestjs/common'

describe('UserCreateService', () => {
  let service: UserCreateService
  let userRepositoryMock: UserRepositoryMock

  beforeEach(async () => {
    userRepositoryMock = createUserRepositoryMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateService,
        {
          provide: USER_REPOSITORY_PORT,
          useValue: userRepositoryMock,
        },
      ],
    }).compile()

    service = module.get<UserCreateService>(UserCreateService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // When
      const createUserCommand: CreateUserCommand = {
        email: randEmail(),
        name: randFirstName(),
      }

      userRepositoryMock.findOneByEmail.mockResolvedValue(null)

      const createdUser = new User({
        email: createUserCommand.email,
        name: createUserCommand.name,
      })

      userRepositoryMock.save.mockResolvedValue(createdUser)

      // Got
      const result = await service.createUser(createUserCommand)

      // Then
      expect(result).toEqual(createdUser)
      expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        createUserCommand.email,
      )
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserCommand.email,
          name: createUserCommand.name,
        }),
      )
    })

    it('should throw an error when email already exists', async () => {
      // When
      const createUserCommand: CreateUserCommand = {
        email: randEmail(),
        name: randFirstName(),
      }

      const existingUser = new User({
        email: createUserCommand.email,
        name: createUserCommand.name,
      })

      userRepositoryMock.findOneByEmail.mockResolvedValue(existingUser)

      // Got & Then
      try {
        await service.createUser(createUserCommand)
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe('Email already exists')
        expect(error.cause).toEqual({ command: createUserCommand })
        expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
          createUserCommand.email,
        )
        expect(userRepositoryMock.save).not.toHaveBeenCalled()
      }
    })
  })
})
