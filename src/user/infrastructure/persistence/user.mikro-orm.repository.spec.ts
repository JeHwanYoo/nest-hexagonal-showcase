import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@/user/domain/model/user.model'
import { UserEntity } from './entities/user.entity'
import { UserMikroOrmRepository } from './user.mikro-orm.repository'
import { SqliteDriver } from '@mikro-orm/sqlite'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { randEmail, randFirstName } from '@ngneat/falso'

describe('UserMikroOrmRepository', () => {
  let repository: UserMikroOrmRepository
  let orm: MikroORM
  let testingModule: TestingModule

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          entities: [UserEntity],
          dbName: ':memory:',
          driver: SqliteDriver,
          allowGlobalContext: true,
        }),
        MikroOrmModule.forFeature([UserEntity]),
      ],
      providers: [UserMikroOrmRepository],
    }).compile()

    repository = testingModule.get<UserMikroOrmRepository>(
      UserMikroOrmRepository,
    )
    orm = testingModule.get<MikroORM>(MikroORM)

    // Create schema
    const generator = orm.getSchemaGenerator()
    await generator.createSchema()
  })

  afterEach(async () => {
    // Drop schema
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()
    await orm.close()
    await testingModule.close()
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  describe('save', () => {
    it('should save user and return domain model', async () => {
      // When
      const user = User.create(randEmail(), randFirstName())

      // Got
      const savedUser = await repository.save(user)

      // Then
      expect(savedUser).toBeDefined()
      expect(savedUser.id).toBeDefined()
      expect(savedUser.email).toBe(user.email)
      expect(savedUser.name).toBe(user.name)
      expect(savedUser.createdAt).toBeDefined()
      expect(savedUser.updatedAt).toBeDefined()
    })
  })

  describe('findById', () => {
    it('should find user by ID', async () => {
      // When
      const user = User.create(randEmail(), randFirstName())
      const savedUser = await repository.save(user)

      // Got
      const foundUser = await repository.findById(savedUser.id)

      // Then
      expect(foundUser).toBeDefined()
      expect(foundUser?.id).toBe(savedUser.id)
      expect(foundUser?.email).toBe(savedUser.email)
      expect(foundUser?.name).toBe(savedUser.name)
    })

    it('should return null when user does not exist', async () => {
      // When
      const nonExistentId = 'non-existent-id'

      // Got
      const foundUser = await repository.findById(nonExistentId)

      // Then
      expect(foundUser).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // When
      const user = User.create(randEmail(), randFirstName())
      await repository.save(user)

      // Got
      const foundUser = await repository.findByEmail(user.email)

      // Then
      expect(foundUser).toBeDefined()
      expect(foundUser?.id).toBeDefined()
      expect(foundUser?.email).toBe(user.email)
      expect(foundUser?.name).toBe(user.name)
    })

    it('should return null when user with email does not exist', async () => {
      // When
      const nonExistentEmail = 'non-existent@example.com'

      // Got
      const foundUser = await repository.findByEmail(nonExistentEmail)

      // Then
      expect(foundUser).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      // When
      const user1 = User.create(randEmail(), randFirstName())
      const user2 = User.create(randEmail(), randFirstName())
      await repository.save(user1)
      await repository.save(user2)

      // Got
      const users = await repository.findAll()

      // Then
      expect(users).toHaveLength(2)
      expect(users.map((u) => u.email)).toContain(user1.email)
      expect(users.map((u) => u.email)).toContain(user2.email)
    })

    it('should return empty array when no users exist', async () => {
      // Got
      const users = await repository.findAll()

      // Then
      expect(users).toHaveLength(0)
    })
  })
})
