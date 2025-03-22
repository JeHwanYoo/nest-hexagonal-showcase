import { Test, TestingModule } from '@nestjs/testing'
import { randEmail, randFirstName } from '@ngneat/falso'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { User } from '../domain/model/user.model'
import { USER_REPOSITORY_PORT } from '../domain/ports/out/user-repository.port'
import {
  createUserRepositoryMock,
  UserRepositoryMock,
} from './mock/user.repository.mock'
import { UserFindService } from './user.find.service'

describe('UserFindService', () => {
  let service: UserFindService
  let userRepositoryMock: UserRepositoryMock

  beforeEach(async () => {
    userRepositoryMock = createUserRepositoryMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFindService,
        {
          provide: USER_REPOSITORY_PORT,
          useValue: userRepositoryMock,
        },
      ],
    }).compile()

    service = module.get<UserFindService>(UserFindService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOneById', () => {
    it('should return a user when found by id', async () => {
      // When
      const mockUser = new User({
        email: randEmail(),
        name: randFirstName(),
      })

      userRepositoryMock.findOneById.mockResolvedValue(mockUser)

      // Got
      const result = await service.findOneById(mockUser.id)

      // Then
      expect(result).toEqual(mockUser)
      expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(mockUser.id)
      expect(userRepositoryMock.findOneById).toHaveBeenCalledTimes(1)
    })

    it('should return null when user not found by id', async () => {
      // When
      const mockUser = new User({
        email: randEmail(),
        name: randFirstName(),
      })

      userRepositoryMock.findOneById.mockResolvedValue(null)

      // Got
      const result = await service.findOneById(mockUser.id)

      // Then
      expect(result).toBeNull()
      expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(mockUser.id)
      expect(userRepositoryMock.findOneById).toHaveBeenCalledTimes(1)
    })
  })

  describe('findOneByEmail', () => {
    it('should return a user when found by email', async () => {
      // When
      const mockUser = new User({
        email: randEmail(),
        name: randFirstName(),
      })

      userRepositoryMock.findOneByEmail.mockResolvedValue(mockUser)

      // Got
      const result = await service.findOneByEmail(mockUser.email)

      // Then
      expect(result).toEqual(mockUser)
      expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        mockUser.email,
      )
      expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledTimes(1)
    })

    it('should return null when user not found by email', async () => {
      // When
      const mockUser = new User({
        email: randEmail(),
        name: randFirstName(),
      })

      userRepositoryMock.findOneByEmail.mockResolvedValue(null)

      // Got
      const result = await service.findOneByEmail(mockUser.email)

      // Then
      expect(result).toBeNull()
      expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        mockUser.email,
      )
      expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledTimes(1)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      // When
      const mockUsers = [
        new User({
          email: randEmail(),
          name: randFirstName(),
        }),
        new User({
          email: randEmail(),
          name: randFirstName(),
        }),
      ]

      userRepositoryMock.findAll.mockResolvedValue(mockUsers)

      // Got
      const result = await service.findAll()

      // Then
      expect(result).toEqual(mockUsers)
      expect(userRepositoryMock.findAll).toHaveBeenCalledTimes(1)
    })

    it('should return empty array when no users exist', async () => {
      // When
      userRepositoryMock.findAll.mockResolvedValue([])

      // Got
      const result = await service.findAll()

      // Then
      expect(result).toEqual([])
      expect(userRepositoryMock.findAll).toHaveBeenCalledTimes(1)
    })
  })
})
