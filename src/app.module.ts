import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/config/env.config.module'
import { MikroOrmConfigModule } from './shared/config/mikro-orm.config.module'
import { UserModule } from './user/config/user.module'
import { MikroOrmSeedModule } from './shared/config/mikro-orm.seed.module'

@Module({
  imports: [
    MikroOrmConfigModule,
    MikroOrmSeedModule,
    EnvConfigModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
