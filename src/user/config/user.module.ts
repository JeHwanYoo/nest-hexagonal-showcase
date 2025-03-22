import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { UserCreateService } from '../application/user.create.service'
import { UserFindService } from '../application/user.find.service'
import { CREATE_USER_USE_CASE_PORT } from '../domain/ports/in/create-user.usecase'
import { FIND_USER_USE_CASE_PORT } from '../domain/ports/in/find-user.usecase'
import { USER_REPOSITORY_PORT } from '../domain/ports/out/user-repository.port'
import { UserController } from '../infrastructure/api/user.controller'
import { UserEntity } from '../infrastructure/persistence/entities/user.entity'
import { UserMikroOrmRepository } from '../infrastructure/persistence/user.mikro-orm.repository'

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: CREATE_USER_USE_CASE_PORT,
      useClass: UserCreateService,
    },
    {
      provide: FIND_USER_USE_CASE_PORT,
      useClass: UserFindService,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserMikroOrmRepository,
    },
  ],
  exports: [CREATE_USER_USE_CASE_PORT, FIND_USER_USE_CASE_PORT],
})
export class UserModule {}
