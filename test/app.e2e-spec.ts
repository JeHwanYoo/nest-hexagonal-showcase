import { INestApplication } from '@nestjs/common'
import { TestApp } from './helpers/test-app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { randEmail, randFirstName } from '@ngneat/falso'
import { ValidationPipe } from '@nestjs/common'
import { UserResponseDto } from '@/user/infrastructure/api/dto/user-response.dto'

describe('User API (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await TestApp.create()
    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )

    await app.init()
  }, 60000)

  afterAll(async () => {
    await app.close()
    await TestApp.cleanup()
  })

  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      // When
      const userData = {
        email: randEmail(),
        name: randFirstName(),
      }

      // Got
      const response: { body: UserResponseDto } = await request(
        app.getHttpServer(),
      )
        .post('/users')
        .send(userData)
        .expect(201)

      // Then
      expect(response.body).toBeDefined()
      expect(response.body.id).toBeDefined()
      expect(response.body.email).toBe(userData.email)
      expect(response.body.name).toBe(userData.name)
      expect(response.body.createdAt).toBeDefined()
      expect(response.body.updatedAt).toBeDefined()
    })

    it('should fail with invalid data', async () => {
      // When
      const userData = {
        name: randFirstName(),
      }

      // Got & Then
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(400)
    })

    it('should fail when email already exists', async () => {
      // When
      const userData = {
        email: randEmail(),
        name: randFirstName(),
      }

      // 먼저 사용자 생성
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201)

      // 동일한 이메일로 다시 생성 시도
      const response: { body: { message: string } } = await request(
        app.getHttpServer(),
      )
        .post('/users')
        .send(userData)
        .expect(400)

      // Then
      expect(response.body.message).toContain('이미 존재하는 이메일입니다')
    })
  })

  describe('GET /users/:id', () => {
    it('should get user by id', async () => {
      // When
      const userData = {
        email: randEmail(),
        name: randFirstName(),
      }

      const createResponse: { body: UserResponseDto } = await request(
        app.getHttpServer(),
      )
        .post('/users')
        .send(userData)
        .expect(201)

      const userId = createResponse.body.id

      // Got
      const response: { body: UserResponseDto } = await request(
        app.getHttpServer(),
      )
        .get(`/users/${userId}`)
        .expect(200)

      // Then
      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(userId)
      expect(response.body.email).toBe(userData.email)
      expect(response.body.name).toBe(userData.name)
    })

    it('should return 404 for non-existent user', async () => {
      // When
      const nonExistentId = 'non-existent-id'

      // Got & Then
      await request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .expect(404)
    })
  })

  describe('GET /users', () => {
    it('should get all users', async () => {
      // When
      const user1 = {
        email: randEmail(),
        name: randFirstName(),
      }

      const user2 = {
        email: randEmail(),
        name: randFirstName(),
      }

      await request(app.getHttpServer()).post('/users').send(user1).expect(201)
      await request(app.getHttpServer()).post('/users').send(user2).expect(201)

      // Got
      const response: { body: UserResponseDto[] } = await request(
        app.getHttpServer(),
      )
        .get('/users')
        .expect(200)

      // Then
      expect(response.body).toBeDefined()
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThanOrEqual(2)

      // Check if our users are included
      expect(response.body.some((u) => u.email === user1.email)).toBe(true)
      expect(response.body.some((u) => u.email === user2.email)).toBe(true)
    })

    it('should get user by email query parameter', async () => {
      const userData = {
        email: randEmail(),
        name: randFirstName(),
      }

      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201)

      const response: { body: UserResponseDto[] } = await request(
        app.getHttpServer(),
      )
        .get(`/users?email=${encodeURIComponent(userData.email)}`)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(1)
      expect(response.body[0].email).toBe(userData.email)
      expect(response.body[0].name).toBe(userData.name)
    })

    it('should return empty array for non-existent email', async () => {
      const nonExistentEmail = 'non-existent@example.com'

      await request(app.getHttpServer())
        .get(`/users?email=${nonExistentEmail}`)
        .expect([])
    })

    it('should return empty array when no users exist', async () => {
      const isolatedModule = await TestApp.create()
      const isolatedApp = isolatedModule.createNestApplication()
      await isolatedApp.init()

      try {
        // Got
        const response: { body: UserResponseDto[] } = await request(
          isolatedApp.getHttpServer(),
        )
          .get('/users')
          .expect(200)

        // Then
        expect(response.body).toBeDefined()
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBe(0)
      } finally {
        await isolatedApp.close()
      }
    })
  })
})
