import { Test, TestingModule } from '@nestjs/testing'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SqliteContainer } from './sqlite-container'
import { UserEntity } from '@/user/infrastructure/persistence/entities/user.entity'
import { UserMikroOrmRepository } from '@/user/infrastructure/persistence/user.mikro-orm.repository'
import { UserCreateService } from '@/user/application/user.create.service'
import { UserFindService } from '@/user/application/user.find.service'
import { UserController } from '@/user/infrastructure/api/user.controller'
import { CREATE_USER_USE_CASE_PORT } from '@/user/domain/ports/in/create-user.usecase'
import { FIND_USER_USE_CASE_PORT } from '@/user/domain/ports/in/find-user.usecase'
import { USER_REPOSITORY_PORT } from '@/user/domain/ports/out/user-repository.port'
import { MikroORM } from '@mikro-orm/core'
import { SqliteDriver } from '@mikro-orm/sqlite'

export class TestApp {
  private static app: TestingModule | undefined

  static async create(): Promise<TestingModule> {
    if (!this.app) {
      const dbOptions = await SqliteContainer.getConnectionOptions()

      this.app = await Test.createTestingModule({
        imports: [
          MikroOrmModule.forRoot({
            entities: [UserEntity],
            driver: SqliteDriver,
            dbName: dbOptions.dbPath,
            // SQLite 특화 설정
            allowGlobalContext: true,
          }),
          MikroOrmModule.forFeature([UserEntity]),
        ],
        controllers: [UserController],
        providers: [
          UserMikroOrmRepository,
          UserCreateService,
          UserFindService,
          {
            provide: USER_REPOSITORY_PORT,
            useExisting: UserMikroOrmRepository,
          },
          {
            provide: CREATE_USER_USE_CASE_PORT,
            useExisting: UserCreateService,
          },
          {
            provide: FIND_USER_USE_CASE_PORT,
            useExisting: UserFindService,
          },
        ],
      }).compile()

      // MikroORM 스키마 초기화
      const orm = this.app.get<MikroORM>(MikroORM)
      const generator = orm.getSchemaGenerator()
      await generator.dropSchema()
      await generator.createSchema()
    }

    return this.app
  }

  static async cleanup(): Promise<void> {
    if (this.app) {
      const orm = this.app.get<MikroORM>(MikroORM)
      await orm.close()
      await this.app.close()
      await SqliteContainer.stop()
      this.app = undefined
    }
  }
}
