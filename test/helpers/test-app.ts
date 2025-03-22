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
import { v4 as uuidv4 } from 'uuid'

export class TestApp {
  private static instances = new Map<
    string,
    { module: TestingModule; orm: MikroORM }
  >()

  static async create(): Promise<TestingModule> {
    const instanceId = uuidv4()
    const dbOptions = await SqliteContainer.getConnectionOptions()

    const uniqueDbName = `${dbOptions.dbPath}_${instanceId}`

    const module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          entities: [UserEntity],
          driver: SqliteDriver,
          dbName: uniqueDbName,
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

    const orm = module.get<MikroORM>(MikroORM)
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()
    await generator.createSchema()

    this.instances.set(instanceId, { module, orm })

    return module
  }

  static async cleanup(): Promise<void> {
    for (const [id, { module, orm }] of this.instances.entries()) {
      await orm.close()
      await module.close()
      this.instances.delete(id)
    }

    await SqliteContainer.stop()
    await SqliteContainer.cleanup()
  }
}
