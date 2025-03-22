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
import { v7 as uuidv7 } from 'uuid'

describe('UserController', () => {
  let controller: UserController
  let createUserUseCaseMock: CreateUserUseCaseMock
  let findUserUseCaseMock: FindUserUseCaseMock

  beforeEach(async () => {
    // Given
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

  describe('createUser method', () => {
    it('should create a user and return UserResponseDto with valid user information', async () => {
      // Given
      const createUserDto: CreateUserDto = {
        email: randEmail(),
        name: randFirstName(),
      }

      const userId = uuidv7()
      const expectedUser = new User({
        id: userId,
        email: createUserDto.email,
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      createUserUseCaseMock.createUser.mockResolvedValue(expectedUser)

      // When
      const result = await controller.createUser(createUserDto)

      // Then
      expect(createUserUseCaseMock.createUser).toHaveBeenCalledWith(
        createUserDto,
      )
      expect(result).toBeDefined()
      expect(result.id).toBe(userId)
      expect(result.email).toBe(expectedUser.email)
      expect(result.name).toBe(expectedUser.name)
    })
  })

  describe('getUserById method', () => {
    it('should return UserResponseDto when querying with an existing user ID', async () => {
      // Given
      const userId = uuidv7()
      const expectedUser = new User({
        id: userId,
        email: randEmail(),
        name: randFirstName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      findUserUseCaseMock.findOneById.mockResolvedValue(expectedUser)

      // When
      const result = await controller.getUserById(userId)

      // Then
      expect(findUserUseCaseMock.findOneById).toHaveBeenCalledWith(userId)
      expect(result).toBeDefined()
      expect(result.id).toBe(userId)
      expect(result.email).toBe(expectedUser.email)
      expect(result.name).toBe(expectedUser.name)
    })

    it('should throw NotFoundException when querying with a non-existent user ID', async () => {
      // Given
      const nonExistentUserId = uuidv7()
      findUserUseCaseMock.findOneById.mockResolvedValue(null)

      // When & Then
      await expect(controller.getUserById(nonExistentUserId)).rejects.toThrow(
        NotFoundException,
      )
      expect(findUserUseCaseMock.findOneById).toHaveBeenCalledWith(
        nonExistentUserId,
      )
    })
  })

  describe('getUsers method', () => {
    it('should return an array of UserResponseDto when users exist', async () => {
      // Given
      const user1Id = uuidv7()
      const user2Id = uuidv7()
      const expectedUsers = [
        new User({
          id: user1Id,
          email: randEmail(),
          name: randFirstName(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new User({
          id: user2Id,
          email: randEmail(),
          name: randFirstName(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ]

      findUserUseCaseMock.findAll.mockResolvedValue(expectedUsers)

      // When
      const result = await controller.getUsers()

      // Then
      expect(findUserUseCaseMock.findAll).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(user1Id)
      expect(result[0].email).toBe(expectedUsers[0].email)
      expect(result[0].name).toBe(expectedUsers[0].name)
      expect(result[1].id).toBe(user2Id)
      expect(result[1].email).toBe(expectedUsers[1].email)
      expect(result[1].name).toBe(expectedUsers[1].name)
    })

    it('should return an empty array when no users exist', async () => {
      // Given
      findUserUseCaseMock.findAll.mockResolvedValue([])

      // When
      const result = await controller.getUsers()

      // Then
      expect(findUserUseCaseMock.findAll).toHaveBeenCalled()
      expect(result).toHaveLength(0)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return an array with one user when searching by email and user exists', async () => {
      // Given
      const userEmail = randEmail()
      const userId = uuidv7()
      const expectedUser = new User({
        id: userId,
        email: userEmail,
        name: randFirstName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      findUserUseCaseMock.findOneByEmail.mockResolvedValue(expectedUser)

      // When
      const result = await controller.getUsers(userEmail)

      // Then
      expect(findUserUseCaseMock.findOneByEmail).toHaveBeenCalledWith(userEmail)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(userId)
      expect(result[0].email).toBe(expectedUser.email)
      expect(result[0].name).toBe(expectedUser.name)
    })

    it('should return an empty array when searching by email and user does not exist', async () => {
      // Given
      const nonExistentEmail = 'nonexistent@example.com'
      findUserUseCaseMock.findOneByEmail.mockResolvedValue(null)

      // When
      const result = await controller.getUsers(nonExistentEmail)

      // Then
      expect(findUserUseCaseMock.findOneByEmail).toHaveBeenCalledWith(
        nonExistentEmail,
      )
      expect(result).toHaveLength(0)
      expect(Array.isArray(result)).toBe(true)
    })
  })
})
