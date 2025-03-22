import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { CREATE_USER_USE_CASE_PORT } from '../../domain/ports/in/create-user.usecase'
import { FIND_USER_USE_CASE_PORT } from '../../domain/ports/in/find-user.usecase'
import { User } from '../../domain/model/user.model'
import { NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  CreateUserUseCaseMock,
  createCreateUserUseCaseMock,
} from './mock/create-user-usecase.mock'
import {
  FindUserUseCaseMock,
  createFindUserUseCaseMock,
} from './mock/find-user-usecase.mock'
import { randEmail, randFirstName } from '@ngneat/falso'

describe('UserController', () => {
  let controller: UserController
  let createUserUseCaseMock: CreateUserUseCaseMock
  let findUserUseCaseMock: FindUserUseCaseMock

  beforeEach(async () => {
    // Create mock implementations
    createUserUseCaseMock = createCreateUserUseCaseMock()
    findUserUseCaseMock = createFindUserUseCaseMock()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CREATE_USER_USE_CASE_PORT,
          useValue: createUserUseCaseMock,
        },
        {
          provide: FIND_USER_USE_CASE_PORT,
          useValue: findUserUseCaseMock,
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createUser', () => {
    it('should create user and return UserResponseDto', async () => {
      // When
      const createUserDto: CreateUserDto = {
        email: randEmail(),
        name: randFirstName(),
      }

      const createdUser = new User({
        id: '123',
        email: createUserDto.email,
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      createUserUseCaseMock.createUser.mockResolvedValue(createdUser)

      // Got
      const result = await controller.createUser(createUserDto)

      // Then
      expect(createUserUseCaseMock.createUser).toHaveBeenCalledWith(
        createUserDto,
      )
      expect(result).toBeDefined()
      expect(result.id).toBe(createdUser.id)
      expect(result.email).toBe(createdUser.email)
      expect(result.name).toBe(createdUser.name)
    })
  })

  describe('getUserById', () => {
    it('should find user by ID and return UserResponseDto', async () => {
      // When
      const userId = '123'
      const user = new User({
        id: userId,
        email: randEmail(),
        name: randFirstName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      findUserUseCaseMock.findOneById.mockResolvedValue(user)

      // Got
      const result = await controller.getUserById(userId)

      // Then
      expect(findUserUseCaseMock.findOneById).toHaveBeenCalledWith(userId)
      expect(result).toBeDefined()
      expect(result.id).toBe(user.id)
      expect(result.email).toBe(user.email)
      expect(result.name).toBe(user.name)
    })

    it('should throw NotFoundException when user does not exist', async () => {
      // When
      const userId = 'non-existent-id'
      findUserUseCaseMock.findOneById.mockResolvedValue(null)

      // Got & Then
      await expect(controller.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      )
      expect(findUserUseCaseMock.findOneById).toHaveBeenCalledWith(userId)
    })
  })

  describe('getAllUsers', () => {
    it('should find all users and return UserResponseDto array', async () => {
      // When
      const users = [
        new User({
          id: '123',
          email: randEmail(),
          name: randFirstName(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new User({
          id: '456',
          email: randEmail(),
          name: randFirstName(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ]

      findUserUseCaseMock.findAll.mockResolvedValue(users)

      // Got
      const result = await controller.getAllUsers()

      // Then
      expect(findUserUseCaseMock.findAll).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(users[0].id)
      expect(result[0].email).toBe(users[0].email)
      expect(result[0].name).toBe(users[0].name)
      expect(result[1].id).toBe(users[1].id)
      expect(result[1].email).toBe(users[1].email)
      expect(result[1].name).toBe(users[1].name)
    })

    it('should return empty array when no users exist', async () => {
      // When
      findUserUseCaseMock.findAll.mockResolvedValue([])

      // Got
      const result = await controller.getAllUsers()

      // Then
      expect(findUserUseCaseMock.findAll).toHaveBeenCalled()
      expect(result).toHaveLength(0)
    })
  })
})
