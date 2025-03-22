import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/config/env.config.module'
import { MikroOrmConfigModule } from './shared/config/mikro-orm.config.module'

@Module({
  imports: [MikroOrmConfigModule, EnvConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
